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
  titulo: string = '';
  registrosTbk: any[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  totalesTbk: { saldoEstimado: number; saldoPorCobrar: number } | null = null;
  rutSeleccionado: string = '';
  modalHistorialRut: boolean = false;
  tipoBackend: string = '';

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
      // 1. Limpia los datos al cambiar la URL para evitar que se "peguen"
      this.registrosTbk = [];
      this.totalesTbk = null;

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
    if (!this.tipo || !this.startDate || !this.endDate) {
      this.registrosTbk = [];
      this.totalesTbk = null;
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
          if (Array.isArray(res.data.detalle_transacciones)) {
            this.registrosTbk = res.data.detalle_transacciones.map((r: any) => ({
              ...r,
              action: {
                isAction: true,
                icon: 'cil-history',
                color: 'info',
                action: () => this.abrirHistorialRut(r.RUT),
              },
              FECHA_VENTA: formatFechaAny(r.FECHA_VENTA),
              FECHA_ABONO: formatFechaAny(r.FECHA_ABONO),
              MONTO: formatCLP(r.MONTO),
              DEUDA_PAGADA: formatCLP(r.DEUDA_PAGADA),
              DEUDA_POR_PAGAR: formatCLP(r.DEUDA_POR_PAGAR),
              TOTAL_CUOTAS: r.TOTAL_CUOTAS ?? null,
              CUOTAS_RESTANTES: r.CUOTAS_RESTANTES ?? null,
            }));
            this.notifier.notify('success', 'Cartola cargada');
          } else {
            this.registrosTbk = [];
          }

          if (Array.isArray(res.data.totales) && res.data.totales.length > 0) {
            this.totalesTbk = {
              saldoEstimado: res.data.totales[0].SALDO_ESTIMADO,
              saldoPorCobrar: res.data.totales[0].SALDO_POR_COBRAR,
            };
          } else {
            this.totalesTbk = null;
          }
        } else {
          this.registrosTbk = [];
          this.totalesTbk = null;
          this.notifier.notify('warning', 'No existen datos asociados a la fecha seleccionada');
        }
      },
      error: (err) => {
        this.registrosTbk = [];
        this.totalesTbk = null;
        this.notifier.notify('error', 'Cartola no cargada', err);
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

  abrirHistorialRut(rut: string) {
    this.modalHistorialRut = true;
    this.rutSeleccionado = rut;
  }

  Exportar() {
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
      },
      error: (err) => {
        console.error('Error exportando Excel:', err);
      },
    });
  }

  onCloseModal() {
    this.modalHistorialRut = false;
  }
}
