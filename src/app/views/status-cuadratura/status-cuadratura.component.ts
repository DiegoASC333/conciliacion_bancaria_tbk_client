import { Component } from '@angular/core';
import { StatusCuadraturaService } from '../../services/status-cuadratura.service';
import { formatFechaTbk, formatCLP } from '../../utils/utils';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-status-cuadratura',
  templateUrl: './status-cuadratura.component.html',
  styleUrls: ['./status-cuadratura.component.scss'],
})
export class StatusCuadraturaComponent {
  totalDiario = 0;
  aprobadosDiario = 0;
  rechazadosDiario = 0;
  reprocesadosDiario = 0;
  monto_aprobados: string = '';
  monto_rechazados: string = '';
  monto_reprocesados: string = '';
  monto_total_diario: string = '';
  tipo: string = '';
  tipoTransaccion: string = '';
  columns: any[] = [];
  items: any[] = [];
  visible: boolean = false;
  viewModalRegistros: boolean = false;
  registrosTbk: any[] = [];
  cupon: number = 0;
  usuario: number = 19273978;

  /**
   * @param {NotifierService} notifier - Servicio para mostrar notificaciones.
   **/

  constructor(
    private statusCuadraturaService: StatusCuadraturaService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.getStatusCuadraturaDiaria();
  }

  getStatusCuadraturaDiaria() {
    this.statusCuadraturaService.getStatusCuadraturaDiaria().subscribe(
      (res: any) => {
        if (res.status === 200 && res?.data) {
          this.totalDiario = res.data.total_diario;
          this.monto_total_diario = formatCLP(res.data.monto_total_diario);
          this.aprobadosDiario = res.data.aprobados_diario;
          this.monto_aprobados = formatCLP(res.data.monto_aprobados);
          this.rechazadosDiario = res.data.rechazados_diario;
          this.monto_rechazados = formatCLP(res.data.monto_rechazados);
          this.reprocesadosDiario = res.data.reprocesados_diario;
          this.monto_reprocesados = formatCLP(res.data.monto_reprocesados);
        } else {
          console.log('Error');
        }
      },
      (err) => console.error('HTTP error', err)
    );
  }

  RedirectTbkRegistros(tipo: string, tipoTransaccion: string) {
    this.viewModalRegistros = false;
    this.registrosTbk = [];

    this.statusCuadraturaService.getRegistrosTbk(tipo, tipoTransaccion).subscribe({
      next: (res: any) => {
        if (res.status === 200 && res.data) {
          this.registrosTbk = res.data.map((r: any) => ({
            ...r,
            FECHA_ABONO: formatFechaTbk(r.FECHA_ABONO),
            FECHA_VENTA: formatFechaTbk(r.FECHA_VENTA),
            MONTO_TRANSACCION: formatCLP(r.MONTO_TRANSACCION),
            ...(tipo === 'rechazados' && {
              action: {
                isAction: true,
                action: () => this.onReprocesar(r),
                label: 'Reprocesar',
                color: 'warning',
                class: 'text-light',
              },
            }),
          }));
          this.viewModalRegistros = true;
          this.notifier.notify('success', 'Cuadratura cargada');
        } else {
          this.registrosTbk = [];
          this.viewModalRegistros = false;
          this.notifier.notify(
            'warning',
            'No se encontraron registros o hubo un problema con la respuesta.'
          );
        }
      },
      error: (err) => {
        console.error('Error al obtener los registros:', err);
        this.notifier.notify('error', 'Error al obtener los registros' + err);
        this.registrosTbk = [];
        this.viewModalRegistros = false;
      },
    });
  }

  onReprocesar(item: any) {
    item.action.disabled = true;

    this.cupon = item.CUPON ?? null;

    this.statusCuadraturaService.reprocesarCupon(this.cupon).subscribe({
      next: () => {
        this.registrosTbk = this.registrosTbk.filter((r) => r !== item);
        this.getStatusCuadraturaDiaria();
      },
      error: () => {
        item.action.disabled = false;
      },
    });
  }

  enviarTesoreria() {
    if (this.rechazadosDiario > 0 && this.aprobadosDiario > 0) {
      alert('No se puede enviar a tesorería si hay registros con conflictos');
    }

    const usuarioId = this.usuario || 'desconocido';

    const data = {
      usuarioId,
      observacion: 'Envío a tesorería desde aplicativo',
    };

    this.statusCuadraturaService.enviarTesorería(data).subscribe({
      next: (res: any) => {
        console.log(res);
        this.getStatusCuadraturaDiaria();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onCloseModal() {
    this.viewModalRegistros = false;
    this.registrosTbk = [];
  }
}
