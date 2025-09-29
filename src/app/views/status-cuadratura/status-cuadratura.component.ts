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
  selectedDate: Date = new Date();
  PendientesAnteriores: boolean = false;
  perfilDelUsuario: string = 'FICA'; //TODO: CAMBIAR ESTO CUANDO CONECTE LOGIN

  /**
   * @param {NotifierService} notifier - Servicio para mostrar notificaciones.
   **/

  constructor(
    private statusCuadraturaService: StatusCuadraturaService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    //this.getStatusCuadraturaDiaria();
    this.getStatusCuadraturaDiaria(this.selectedDate);
    this.ejecutarValidacionFechasAnteriores(this.selectedDate);
    console.log('perfil', this.perfilDelUsuario);
  }

  onDateChange(newDate: Date) {
    this.selectedDate = newDate;
    this.getStatusCuadraturaDiaria(newDate);
    this.ejecutarValidacionFechasAnteriores(newDate);
  }

  getStatusCuadraturaDiaria(dateToQuery: Date) {
    this.statusCuadraturaService
      .getStatusCuadraturaDiaria(dateToQuery, this.perfilDelUsuario)
      .subscribe(
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

  RedirectTbkRegistros(tipo: string, tipoTransaccion: string, dateToQuery: Date) {
    this.viewModalRegistros = false;
    this.registrosTbk = [];

    this.statusCuadraturaService
      .getRegistrosTbk(tipo, tipoTransaccion, dateToQuery, this.perfilDelUsuario)
      .subscribe({
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
                  //action: () => this.onReprocesar(r),
                  action: 'reprocesar',
                  label: 'Reprocesar',
                  color: 'warning',
                  class: 'text-light',
                },
              }),
            }));
            //console.log('[Padre] registrosTbk después de map =>', this.registrosTbk);
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
          this.limpiarDatos();
        },
      });
  }

  limpiarDatos() {
    this.totalDiario = 0;
    this.monto_total_diario = formatCLP(0);
    this.aprobadosDiario = 0;
    this.monto_aprobados = formatCLP(0);
    this.rechazadosDiario = 0;
    this.monto_rechazados = formatCLP(0);
    this.reprocesadosDiario = 0;
    this.monto_reprocesados = formatCLP(0);
  }

  onReprocesar(item: any) {
    console.log('[Padre] onReprocesar called', item);
    item.action.disabled = true;

    this.cupon = item.CUPON ?? null;

    this.statusCuadraturaService.reprocesarCupon(this.cupon).subscribe({
      next: () => {
        this.notifier.notify('success', `Cupón ${this.cupon} reprocesado.`);
        this.registrosTbk = this.registrosTbk.filter((r) => r !== item);
        this.getStatusCuadraturaDiaria(this.selectedDate);
      },
      error: () => {
        item.action.disabled = false;
      },
    });
  }

  enviarTesoreria() {
    if (this.rechazadosDiario > 0) {
      this.notifier.notify('warning', 'No se puede enviar si existen registros con conflictos');
      return;
    }

    if (this.aprobadosDiario === 0) {
      this.notifier.notify('info', 'No hay registros aprobados para enviar.');
      return;
    }

    const usuarioId = this.usuario || 'desconocido';

    const data = {
      usuarioId,
      observacion: 'Envío a tesorería desde aplicativo',
      fecha: this.selectedDate,
      totalDiario: this.monto_total_diario,
    };

    this.statusCuadraturaService.enviarTesorería(data).subscribe({
      next: (res: any) => {
        this.notifier.notify('success', res.message || 'Registros enviados a tesorería.');

        this.getStatusCuadraturaDiaria(this.selectedDate);
      },
      error: (err) => {
        console.error(err);
        this.notifier.notify('error', err.error?.message || 'Ocurrió un error inesperado.');
      },
    });
  }

  onCloseModal() {
    this.viewModalRegistros = false;
    this.registrosTbk = [];
  }

  ejecutarValidacionFechasAnteriores(fechaAValidar: Date): void {
    this.statusCuadraturaService.validarFechasAnteriores(fechaAValidar).subscribe({
      next: (res: any) => {
        if (res.success && res.data?.existenPendientes) {
          this.PendientesAnteriores = true;
          const fechaPendiente = res.data.fechaMasReciente; // ej: '250530'
          this.notifier.notify(
            'warning',
            `¡Atención! Existen registros pendientes en días anteriores (ej: ${fechaPendiente}).`
          );
        }
      },
      error: (err) => {
        console.error('Error al realizar la validación de fechas:', err);
      },
    });
  }
}
