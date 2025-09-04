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
  tipo: string = '';
  columns: any[] = [];
  items: any[] = [];
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
          this.aprobadosDiario = res.data.aprobados_diario;
          this.rechazadosDiario = res.data.rechazados_diario;
          this.reprocesadosDiario = res.data.reprocesados_diario;
        } else {
          console.log('Error');
        }
      },
      (err) => console.error('HTTP error', err)
    );
  }

  // RedirectTbkRegistros(tipo: string) {
  //   if (tipo === 'rechazados') {
  //     this.viewModalRegistros = true;
  //     this.registrosTbk = [];

  //     this.statusCuadraturaService.getRegistrosTbk(tipo).subscribe((res: any) => {
  //       if (res.status === 200 && res?.data) {
  //         this.registrosTbk = res.data.map((r: any) => ({
  //           ...r,
  //           FECHA_ABONO: formatFechaTbk(r.FECHA_ABONO),
  //           FECHA_TRANSACCION: formatFechaTbk(r.FECHA_TRANSACCION),
  //           MONTO_TRANSACCION: formatCLP(r.MONTO_TRANSACCION),
  //           action: {
  //             isAction: true,
  //             action: () => this.onReprocesar(r),
  //             label: 'Reprocesar',
  //             color: 'warning',
  //             class: 'text-light',
  //           },
  //         }));
  //       }
  //     });
  //   } else if (tipo === 'reprocesados') {
  //     this.viewModalRegistros = true;
  //     this.statusCuadraturaService.getRegistrosTbk(tipo).subscribe((res: any) => {
  //       if (res.status === 200 && res?.data) {
  //         this.registrosTbk = res.data;
  //       }
  //     });
  //   } else if (tipo === 'aprobados') {
  //     this.viewModalRegistros = true;
  //     this.statusCuadraturaService.getRegistrosTbk(tipo).subscribe((res: any) => {
  //       if (res.status === 200 && res?.data) {
  //         this.registrosTbk = res.data;
  //       }
  //     });
  //   } else if (tipo === 'total') {
  //     this.viewModalRegistros = true;
  //     this.statusCuadraturaService.getRegistrosTbk(tipo).subscribe((res: any) => {
  //       if (res.status === 200 && res?.data) {
  //         this.registrosTbk = res.data;
  //       }
  //     });
  //   }
  // }

  RedirectTbkRegistros(tipo: string) {
    this.viewModalRegistros = true;
    this.registrosTbk = [];

    this.statusCuadraturaService.getRegistrosTbk(tipo).subscribe((res: any) => {
      if (res.status !== 200 || !res?.data) return;

      this.registrosTbk = res.data.map((r: any) => ({
        ...r,
        FECHA_ABONO: formatFechaTbk(r.FECHA_ABONO),
        FECHA_TRANSACCION: formatFechaTbk(r.FECHA_TRANSACCION),
        MONTO_TRANSACCION: formatCLP(r.MONTO_TRANSACCION),
        // Solo agregamos action si es 'rechazados'
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
