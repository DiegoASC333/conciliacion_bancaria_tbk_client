import { Component } from '@angular/core';
import { StatusCuadraturaService } from '../../services/status-cuadratura.service';
import { formatFechaTbk, formatCLP } from '../../utils/utils';
import { NotifierService } from 'angular-notifier';
import { AuthenticationService, User } from '../../services/authentication.service';

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
  id: number = 0;
  usuario: string = '';
  selectedDate: Date = new Date();
  PendientesAnteriores: boolean = false;
  usuarioActual: User | null = null;
  perfilDelUsuario: string = '';
  //perfilDelUsuario: string = 'FICA'; //TODO: CAMBIAR ESTO CUANDO CONECTE LOGIN

  /**
   * @param {NotifierService} notifier - Servicio para mostrar notificaciones.
   **/

  constructor(
    private statusCuadraturaService: StatusCuadraturaService,
    private notifier: NotifierService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    //this.getStatusCuadraturaDiaria();
    this.usuarioActual = this.authService.getCurrentUser();
    if (this.usuarioActual) {
      this.perfilDelUsuario = this.usuarioActual.perfil;
      this.usuario = this.usuarioActual.rut;
    }
    this.getStatusCuadraturaDiaria(this.selectedDate);
    this.ejecutarValidacionFechasAnteriores(this.selectedDate);
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
            this.registrosTbk = res.data.map((r: any) => {
              // Sacamos la propiedad ESTADO y nos quedamos con el resto
              const { ESTADO, ...restoDelObjeto } = r;

              return {
                ...restoDelObjeto, // Esparcimos el objeto ya sin la propiedad ESTADO
                FECHA_ABONO: formatFechaTbk(r.FECHA_ABONO),
                FECHA_VENTA: formatFechaTbk(r.FECHA_VENTA),
                MONTO_TRANSACCION: formatCLP(r.MONTO_TRANSACCION),
                ...(tipo === 'rechazados' && {
                  // La lógica condicional todavía usa el ESTADO del objeto original 'r'
                  action:
                    r.ESTADO === 'REPROCESO'
                      ? {
                          isAction: true,
                          action: 'reprocesar',
                          label: 'Reprocesar',
                          color: 'warning',
                          class: 'text-light',
                        }
                      : {
                          isAction: true,
                          label: 'No disponible reproceso',
                          color: 'secondary',
                        },
                }),
              };
            });
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
    item.action.disabled = true;

    this.cupon = item.CUPON ?? null;
    this.id = item.ID ?? null;

    this.statusCuadraturaService.reprocesarCupon(this.cupon, this.id).subscribe({
      next: (response: any) => {
        this.notifier.notify('success', `Cupón ${this.cupon} reprocesado.`);
        this.registrosTbk = this.registrosTbk.filter((r) => r !== item);
        this.getStatusCuadraturaDiaria(this.selectedDate);
      },
      error: (err: any) => {
        item.action.disabled = false;

        const mensajeError = err.error?.message || 'Ocurrió un error inesperado.';

        this.notifier.notify('error', `Error al reprocesar cupón ${this.cupon}: ${mensajeError}`);
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

    if (!this.usuarioActual) {
      this.notifier.notify('error', 'Usuario no autenticado.');
      return;
    }
    const usuarioId = this.usuarioActual.rut;
    const data = {
      usuarioId,
      observacion: 'Envío a tesorería desde aplicativo',
      fecha: this.selectedDate,
      totalDiario: this.monto_total_diario,
      perfil: this.perfilDelUsuario,
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

  obtenerExcelCuadratura() {
    if (this.rechazadosDiario > 0) {
      this.notifier.notify('warning', 'No se puede exportar si existen registros con conflictos');
    }

    if (this.aprobadosDiario === 0) {
      this.notifier.notify('info', 'No hay registros para exportar');
    }

    const fechaStr = this.selectedDate.toISOString().split('T')[0];

    const data = {
      perfil: this.perfilDelUsuario,
      fecha: fechaStr,
    };

    this.statusCuadraturaService.exportarExcel(data).subscribe({
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

        a.download = `cuadratura_${this.perfilDelUsuario}_${fecha}.xlsx`;

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
}
