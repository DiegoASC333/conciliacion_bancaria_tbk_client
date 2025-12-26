import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartolaTbkService } from '../../services/cartola-tbk.service';
import { formatFechaAny, formatCLP } from '../../utils/utils';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-cartola-tbk',
  templateUrl: './cartola-tbk.component.html',
  styleUrls: ['./cartola-tbk.component.scss'],
})
export class CartolaTbkComponent implements OnInit {
  tipo: string = '';
  cuota: number = 0;
  titulo: string = '';
  registrosTbk: any[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  totalesTbk: { saldoEstimado: number; saldoPorCobrar: number; saldoTotalVentas: number } | null =
    null;
  rutSeleccionado: string = '';
  cuponSeleccionado: string = '';
  modalHistorialRut: boolean = false;
  tipoBackend: string = '';
  isLoading: boolean = false;
  private isInitialLoad: boolean = true;
  isExporting: boolean = false;
  totalesPorDocumento: any[] = [];

  /**
   * @param {NotifierService} notifier - Servicio para mostrar notificaciones.
   **/
  constructor(
    private route: ActivatedRoute,
    private cartolaTbkSerive: CartolaTbkService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.registrosTbk = [];
      this.totalesTbk = null;
      this.totalesPorDocumento = [];

      const p = params['tipo'];
      if (p === 'credito') {
        this.tipo = 'LCN';
        this.titulo = 'Crédito';
        this.tipoBackend = 'LCN';
      } else if (p === 'debito') {
        this.tipo = 'LDN';
        this.titulo = 'Débito';
        this.tipoBackend = 'LDN';
      } else {
        this.tipo = '';
        this.titulo = '';
      }

      this.loadData();
    });
  }

  loadData(): void {
    //this.isLoading = true;
    if (this.isInitialLoad) {
      this.isInitialLoad = false;
    } else {
      this.isLoading = true;
    }
    if (!this.tipo || !this.startDate || !this.endDate) {
      this.registrosTbk = [];
      this.totalesTbk = null;
      this.isLoading = false;
      return;
    }

    if (this.startDate > this.endDate) {
      [this.startDate, this.endDate] = [this.endDate, this.startDate];
    }

    const data: any = {
      tipo: this.tipo,
      start: this.toOracleStr(this.startDate),
      end: this.toOracleStr(this.endDate),
    };

    this.cartolaTbkSerive.getCartola(data).subscribe({
      next: (res: any) => {
        if (res.status === 200 && res.data) {
          if (
            Array.isArray(res.data.detalle_transacciones) &&
            res.data.detalle_transacciones.length > 0
          ) {
            this.registrosTbk = res.data.detalle_transacciones.map((r: any) => {
              const record: any = {
                FECHA_VENTA: formatFechaAny(r.FECHA_VENTA),
                FECHA_ABONO: formatFechaAny(r.FECHA_ABONO),
                RUT: r.RUT,
                CUPON: r.CUPON,
                CODIGO_AUTORIZACION: r.CODIGO_AUTORIZACION,
                TIPO_DOCUMENTO: r.TIPO_DOCUMENTO,
              };
              if (this.tipo === 'LCN') {
                record.MONTO_VENTA = formatCLP(r.MONTO_VENTA);
                record.MONTO_ABONADO = formatCLP(r.MONTO);
                record.CUOTA = r.CUOTA ?? null;
                record.DEUDA_PAGADA = formatCLP(r.DEUDA_PAGADA);
                record.DEUDA_POR_PAGAR = formatCLP(r.DEUDA_POR_PAGAR);
                record.TOTAL_CUOTAS = r.TOTAL_CUOTAS ?? null;
                record.CUOTAS_RESTANTES = r.CUOTAS_RESTANTES ?? null;
                record.action = {
                  isAction: true,
                  icon: 'cil-history',
                  color: 'info',
                  action: () => this.abrirHistorialRut(r),
                };
              } else if (this.tipo === 'LDN') {
                record.MONTO_ABONADO = formatCLP(r.MONTO);
                record.PENDIENTE_POR_COBRAR = formatCLP(r.DEUDA_POR_PAGAR);
              }
              return record;
            });

            this.notifier.notify('success', 'Cartola cargada');
            this.cargarTotalesPorDocumento();
          } else {
            this.notifier.notify('warning', 'No existen datos asociados al periodo seleccionado');
            this.registrosTbk = [];
          }

          if (Array.isArray(res.data.totales) && res.data.totales.length > 0) {
            this.totalesTbk = {
              saldoEstimado: res.data.totales[0].saldo_estimado,
              saldoPorCobrar: res.data.totales[0].saldo_por_cobrar,
              saldoTotalVentas: res.data.totales[0].saldo_total_ventas,
            };
            console.log(this.totalesTbk);
          } else {
            this.totalesTbk = null;
          }
        } else {
          this.registrosTbk = [];
          this.totalesTbk = null;
          this.notifier.notify('warning', 'No existen datos asociados a la fecha seleccionada');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.registrosTbk = [];
        this.totalesTbk = null;
        this.notifier.notify('error', 'Cartola no cargada', err);
        this.isLoading = false;
      },
    });
  }

  private toOracleStr(d: Date | null): string {
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}${mm}${yyyy}`;
  }

  cargarCartola() {
    this.loadData();
  }

  onDateChange() {
    this.loadData();
  }

  cargarTotalesPorDocumento() {
    const data: any = {
      tipo: this.tipo,
      start: this.toOracleStr(this.startDate),
      end: this.toOracleStr(this.endDate),
    };
    this.cartolaTbkSerive.getTotalesCartolaPorDocumento(data).subscribe({
      next: (res: any) => {
        if (res.status === 200 && res.data) {
          this.totalesPorDocumento = res.data;
        } else {
          this.totalesPorDocumento = [];
        }
      },
      error: (err: any) => {
        this.totalesPorDocumento = [];
        this.notifier.notify('error', 'Error cargando totales por documento', err);
      },
    });
  }

  abrirHistorialRut(r: any) {
    this.rutSeleccionado = r.RUT;
    this.cuponSeleccionado = r.CUPON;
    this.tipoBackend = 'LCN';
    this.cuota = r.CUOTA;

    this.modalHistorialRut = true;
  }

  Exportar() {
    if (this.isExporting) {
      return; // Si ya está exportando, no hacer nada
    }

    this.isExporting = true;
    const data = {
      tipo: this.tipoBackend,
      start: this.toOracleStr(this.startDate),
      end: this.toOracleStr(this.endDate),
    };

    this.cartolaTbkSerive.exportarExcel(data).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const now = new Date();
        const fecha = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          '0'
        )}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(
          2,
          '0'
        )}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(
          2,
          '0'
        )}`;

        a.download = `cartola_${this.tipoBackend}_${fecha}.xlsx`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.notifier.notify('success', 'Excel creado con exito');
        this.isExporting = false;
      },
      error: (err) => {
        //console.error('Error exportando Excel:', err);
        this.notifier.notify('error', 'Error al generar el Excel', err);
        this.isExporting = false;
      },
    });
  }

  onCloseModal() {
    this.modalHistorialRut = false;
  }
}
