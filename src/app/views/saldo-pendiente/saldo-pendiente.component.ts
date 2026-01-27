import { Component } from '@angular/core';
import { formatCLP } from '../../utils/utils';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { SaldoPendienteService } from '../../services/saldo-pendiente.service';

interface TotalesDocumento {
  tipo: string;
  total_transacciones: number;
  total_deuda_pendiente: number;
}

@Component({
  selector: 'app-saldo-pendiente',
  templateUrl: './saldo-pendiente.component.html',
  styleUrls: ['./saldo-pendiente.component.scss'],
})
export class SaldoPendienteComponent {
  tipo: string = '';
  titulo: string = '';
  tipoBackend: string = '';
  selectedDate!: Date; // O selectedDate: Date | null = null;
  saldosPendientes: any[] = [];
  totalPendiente: number = 0;
  totalesDocumento: TotalesDocumento[] = [];
  isLoading: boolean = false;
  isExporting: boolean = false;

  constructor(
    private saldoPentiente: SaldoPendienteService,
    private route: ActivatedRoute,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // 1. Limpieza total de estados anteriores
      this.saldosPendientes = [];
      this.totalPendiente = 0;
      this.totalesDocumento = [];
      this.isLoading = false; // Resetear por si acaso

      const p = params['tipo'];
      if (p === 'credito') {
        this.tipo = 'Crédito'; // Mejor dejar el texto para el H1
        this.tipoBackend = 'LCN';
      } else if (p === 'debito') {
        this.tipo = 'Débito';
        this.tipoBackend = 'LDN';
      }

      // 2. Si el usuario ya eligió una fecha antes de cambiar de pestaña,
      // recargar los datos automáticamente para el nuevo tipo.
      if (this.selectedDate) {
        this.cargarSaldoPendiente();
      }
    });
  }

  onDateSelected(event: Date | null) {
    if (!event) return;

    this.selectedDate = event;
    this.cargarSaldoPendiente();
  }

  cargarSaldoPendiente() {
    if (this.isLoading) return;

    this.isLoading = true;
    // Limpiamos datos previos para asegurar una vista limpia
    this.saldosPendientes = [];
    this.totalPendiente = 0;
    this.totalesDocumento = [];

    const dia = this.selectedDate.getDate().toString().padStart(2, '0');
    const mes = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const anio = this.selectedDate.getFullYear().toString();
    const fechaStrBackend = `${dia}${mes}${anio}`;

    const data = {
      tipo: this.tipoBackend,
      fecha: fechaStrBackend,
    };

    this.saldoPentiente.getSaldoPendiente(data).subscribe({
      next: (response: any) => {
        const detalleOriginal = response.data?.detalle_transacciones || [];
        const total = response.data?.totales?.total_deuda_pendiente || 0;

        if (detalleOriginal.length === 0 && total === 0) {
          this.notifier.notify(
            'warning',
            `No se encontraron registros para el ${dia}/${mes}/${anio}`
          );
          this.saldosPendientes = [];
        } else {
          // Mapeo selectivo solo para los campos de montos
          this.saldosPendientes = detalleOriginal.map((r: any) => {
            const record: any = { ...r }; // Copiamos el resto de los campos ya formateados

            if (this.tipoBackend === 'LCN') {
              // Formateo específico para Crédito
              record.MONTO_VENTA = formatCLP(r.MONTO_VENTA);
              record.DEUDA_POR_PAGAR = formatCLP(r.DEUDA_POR_PAGAR);
            } else if (this.tipoBackend === 'LDN') {
              // Formateo específico para Débito
              record.MONTO_VENTA = formatCLP(r.MONTO_VENTA);
              record.DEUDA_POR_PAGAR = formatCLP(r.DEUDA_POR_PAGAR);
            }

            return record;
          });

          this.totalPendiente = total;
          this.totalesDocumento = this.transformarTotales(
            response.data.totales.totales_por_documento
          );
          this.notifier.notify('success', `Datos cargados correctamente`);
        }

        this.isLoading = false;
      },
      error: (err: any) => {
        this.notifier.notify('error', 'Error al consultar el saldo pendiente.');
        this.isLoading = false;
      },
    });
  }

  Exportar() {
    if (this.isExporting) {
      return; // Si ya está exportando, no hacer nada
    }

    this.isExporting = true;

    const dia = this.selectedDate.getDate().toString().padStart(2, '0');
    const mes = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const anio = this.selectedDate.getFullYear().toString();
    const fechaStrBackend = `${dia}${mes}${anio}`;

    const data = {
      tipo: this.tipoBackend,
      fecha: fechaStrBackend,
    };

    this.saldoPentiente.exportarExcel(data).subscribe({
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

        a.download = `saldo_pendiente_${this.tipoBackend}_${fecha}.xlsx`;

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

  transformarTotales(totalesObj: {
    [key: string]: { total_transacciones: number; total_deuda_pendiente: number };
  }): TotalesDocumento[] {
    if (!totalesObj) return [];

    return Object.keys(totalesObj).map((key) => ({
      tipo: key,
      total_transacciones: totalesObj[key].total_transacciones,
      total_deuda_pendiente: totalesObj[key].total_deuda_pendiente,
    }));
  }
}
