import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LiquidacionServiceService } from '../../services/liquidacion-service.service';
import { formatFechaAny, formatCLP } from '../../utils/utils';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-liquidaciones',
  templateUrl: './liquidaciones.component.html',
  styleUrls: ['./liquidaciones.component.scss'],
})
export class LiquidacionesComponent implements OnInit {
  tipo: string = '';
  titulo: string = '';
  liquidacionesTbk: any[] = [];
  totalesPorComercio: any[] = [];
  totalGeneral: number = 0;
  tipoBackend: string = '';

  /**
   * @param {NotifierService} notifier - Servicio para mostrar notificaciones.
   **/

  constructor(
    private route: ActivatedRoute,
    private liquidacionService: LiquidacionServiceService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const tipo = params['tipo'];
      if (tipo) {
        this.loadLiquidaciones(tipo);
      }
    });
  }

  loadLiquidaciones(tipoUrl: string) {
    this.liquidacionesTbk = [];
    this.totalesPorComercio = [];
    this.totalGeneral = 0;

    if (tipoUrl === 'credito') {
      this.tipoBackend = 'LCN';
      this.titulo = 'Crédito';
    } else if (tipoUrl === 'debito') {
      this.tipoBackend = 'LDN';
      this.titulo = 'Débito';
    } else {
      console.error('Tipo de liquidación desconocido:', tipoUrl);
      return;
    }

    const data = { tipo: this.tipoBackend };

    this.liquidacionService.getLiquidacion(data).subscribe({
      next: (res: any) => {
        if (res.status === 200 && res.data && res.data.detalles_transacciones) {
          this.liquidacionesTbk = res.data.detalles_transacciones.map((r: any) => {
            const limpio = Object.fromEntries(Object.entries(r).filter(([_, v]) => v !== null));

            return {
              ...limpio,
              FECHA_VENTA: formatFechaAny(r.FECHA_VENTA),
              FECHA_ABONO: formatFechaAny(r.FECHA_ABONO),
              TOTAL_ABONADO: formatCLP(r.TOTAL_ABONADO),
              COMISION_NETA: formatCLP(r.COMISION_NETA),
              COMISION_BRUTA: formatCLP(r.COMISION_BRUTA),
            };
          });
          this.notifier.notify('success', 'Liquidación cargada');
          this.totalesPorComercio = res.data.totales_por_comercio;

          if (this.totalesPorComercio?.length > 0) {
            this.totalGeneral = this.totalesPorComercio.reduce(
              (acc: number, t: any) => acc + (t.TOTAL_MONTO || 0),
              0
            );
          } else {
            this.totalGeneral = 0;
          }
        } else {
          this.liquidacionesTbk = [];
          this.totalesPorComercio = [];
          this.totalGeneral = 0;
          this.notifier.notify('warging', 'Error al obtener liquidaciones o datos inválidos');
        }
      },
      error: (err) => {
        this.liquidacionesTbk = [];
        this.totalesPorComercio = [];
        this.totalGeneral = 0;
        this.notifier.notify('error', 'Error al obtener liquidaciones o datos inválidos');
      },
    });
  }

  Exportar() {
    const data = { tipo: this.tipoBackend };

    this.liquidacionService.exportarExcel(data).subscribe({
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

        a.download = `liquidaciones_${this.tipoBackend}_${fecha}.xlsx`;

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
