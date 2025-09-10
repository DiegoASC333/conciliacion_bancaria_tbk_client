import { Component } from '@angular/core';
import { StatusCuadraturaService } from '../../services/status-cuadratura.service';
import { formatFechaTbk, formatCLP } from '../../utils/utils';

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

  constructor(private statusCuadraturaService: StatusCuadraturaService) {}

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

  // RedirectTbkRegistros(tipo: string, tipoTransaccion: string) {
  //   this.viewModalRegistros = false;
  //   this.registrosTbk = [];

  //   this.statusCuadraturaService.getRegistrosTbk(tipo, tipoTransaccion).subscribe((res: any) => {
  //     if (res.status !== 200 || !res?.data) return;

  //     this.registrosTbk = res.data.map((r: any) => ({
  //       ...r,
  //       FECHA_ABONO: formatFechaTbk(r.FECHA_ABONO),
  //       FECHA_TRANSACCION: formatFechaTbk(r.FECHA_TRANSACCION),
  //       MONTO_TRANSACCION: formatCLP(r.MONTO_TRANSACCION),
  //       // Solo agregamos action si es 'rechazados'
  //       ...(tipo === 'rechazados' && {
  //         action: {
  //           isAction: true,
  //           action: () => this.onReprocesar(r),
  //           label: 'Reprocesar',
  //           color: 'warning',
  //           class: 'text-light',
  //         },
  //       }),
  //     }));
  //   });
  // }

  // La función que se ejecuta al hacer clic en los botones del padre
  RedirectTbkRegistros(tipo: string, tipoTransaccion: string) {
    // 1. Ocultamos el modal y limpiamos los datos.
    // Esto asegura que cada vez que se haga clic, el modal se inicie con un estado limpio.
    this.viewModalRegistros = false;
    this.registrosTbk = [];

    // 2. Cargamos los datos desde el servicio.
    // Usamos una promesa para esperar la respuesta.
    this.statusCuadraturaService.getRegistrosTbk(tipo, tipoTransaccion).subscribe({
      next: (res: any) => {
        // 3. Verificamos si la respuesta es exitosa y contiene datos.
        if (res.status === 200 && res.data) {
          // 4. Mapeamos la data como ya lo haces.
          this.registrosTbk = res.data.map((r: any) => ({
            ...r,
            FECHA_ABONO: formatFechaTbk(r.FECHA_ABONO),
            FECHA_TRANSACCION: formatFechaTbk(r.FECHA_TRANSACCION),
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
          // 5. Una vez que los datos están listos, mostramos el modal.
          // Esto asegura que el modal se abra con la data ya cargada.
          this.viewModalRegistros = true;
        } else {
          // 6. Manejamos el caso de una respuesta sin datos o con error.
          this.registrosTbk = [];
          this.viewModalRegistros = false;
          console.warn('No se encontraron registros o hubo un problema con la respuesta.');
          // Opcional: mostrar un mensaje al usuario
        }
      },
      error: (err) => {
        // 7. Manejamos cualquier error del servicio.
        console.error('Error al obtener los registros:', err);
        this.registrosTbk = [];
        this.viewModalRegistros = false;
        // Opcional: mostrar un mensaje de error al usuario
      },
    });
  }

  onReprocesar(item: any) {
    item.action.disabled = true;

    this.cupon = item.CUPON ?? null;

    this.statusCuadraturaService.reprocesarCupon(this.cupon).subscribe({
      next: () => {
        // Quita de la lista de rechazados o refresca
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
    this.viewModalRegistros = false; // cierra el modal
    this.registrosTbk = []; // limpia datos
  }
}
