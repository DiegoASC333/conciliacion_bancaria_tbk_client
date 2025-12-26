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
  selectedDate: Date = new Date();
  saldosPendientes: any[] = [];
  totalPendiente: number = 0;
  totalesDocumento: TotalesDocumento[] = [];

  constructor(
    private saldoPentiente: SaldoPendienteService,
    private route: ActivatedRoute,
    private notifier: NotifierService
  ) {}
  ngOnInit() {}

  onDateSelected(event: Date | null) {
    if (!event) return;
    this.selectedDate = event;
    this.cargarSaldoPendiente();
  }

  cargarSaldoPendiente() {
    // 1. FORMATEO DE FECHA CLAVE: DDMMYYYY
    const dia = this.selectedDate.getDate().toString().padStart(2, '0');
    const mes = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0'); // getMonth es 0-indexado
    const anio = this.selectedDate.getFullYear().toString();

    // Formato final: DDMMYYYY
    const fechaStrBackend = `${dia}${mes}${anio}`;

    const data = {
      fecha: fechaStrBackend,
    };

    // 2. Manejo de la Suscripción
    this.saldoPentiente.getSaldoPendiente(data).subscribe({
      next: (response: any) => {
        // Asumiendo que response tiene la estructura { data: { detalle_transacciones, totales } }
        this.saldosPendientes = response.data.detalle_transacciones || [];
        this.totalPendiente = response.data.totales.total_deuda_pendiente || 0;

        this.totalesDocumento = this.transformarTotales(
          response.data.totales.totales_por_documento
        );

        console.log('totales por documento', this.totalesDocumento);

        // Notificación de éxito
        this.notifier.notify('success', `Datos cargados hasta el ${dia}/${mes}/${anio}`);
      },
      error: (err: any) => {
        console.error('Error al cargar saldo pendiente:', err);
        this.notifier.notify('error', 'Error al consultar el saldo pendiente.');
        this.saldosPendientes = [];
        this.totalPendiente = 0;
        this.totalesDocumento = []; // Limpiar en caso de error
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
