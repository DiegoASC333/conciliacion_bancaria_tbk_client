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

  constructor(
    private route: ActivatedRoute,
    private liquidacionService: LiquidacionServiceService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const tipo = params['tipo'];

      this.liquidacionesTbk = [];
      this.totalesPorComercio = [];

      if (tipo === 'credito') {
        this.getLiquidacionesCredito();
        this.tipoBackend = 'LCN';
      } else if (tipo === 'debito') {
        this.getLiquidacionesDebito();
        this.tipoBackend = 'LDN';
      }
    });
  }

  getLiquidacionesCredito() {
    this.tipo = 'LCN';
    this.titulo = 'Crédito';

    const data = { tipo: this.tipo };

    this.liquidacionService.getLiquidacion(data).subscribe(
      (res: any) => {
        if (res.status === 200 && res.data && res.data.detalles_transacciones) {
          this.liquidacionesTbk = res.data.detalles_transacciones.map((r: any) => ({
            ...r,
            FECHA_VENTA: formatFechaAny(r.FECHA_VENTA),
            FECHA_ABONO: formatFechaAny(r.FECHA_ABONO),
            TOTAL_ABONADO: formatCLP(r.TOTAL_ABONADO),
            COMISION_NETA: formatCLP(r.COMISION_NETA),
            COMISION_BRUTA: formatCLP(r.COMISION_BRUTA),
          }));

          this.totalesPorComercio = res.data.totales_por_comercio;

          // 👉 calcular total general
          this.totalGeneral = this.totalesPorComercio.reduce(
            (acc: number, t: any) => acc + (t.TOTAL_MONTO || 0),
            0
          );
        } else {
          this.liquidacionesTbk = [];
          this.totalesPorComercio = [];
          this.totalGeneral = 0;
          console.error('Error al obtener liquidaciones o datos inválidos');
        }
      },
      (err) => {
        this.liquidacionesTbk = [];
        this.totalesPorComercio = [];
        this.totalGeneral = 0;
        console.error('HTTP error', err);
      }
    );
  }

  getLiquidacionesDebito() {
    this.tipo = 'LDN';
    this.titulo = 'Débito';

    const data = { tipo: this.tipo };

    this.liquidacionService.getLiquidacion(data).subscribe(
      (res: any) => {
        if (res.status === 200 && res.data && res.data.detalles_transacciones) {
          this.liquidacionesTbk = res.data.detalles_transacciones.map((r: any) => {
            // Quita las columnas con null para no mostrarlas
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

          this.totalesPorComercio = res.data.totales_por_comercio;
        } else {
          this.liquidacionesTbk = [];
          this.totalesPorComercio = [];
          console.error('Error al obtener liquidaciones');
        }
      },
      (err) => {
        this.liquidacionesTbk = [];
        this.totalesPorComercio = [];
        console.error('HTTP error', err);
      }
    );
  }

  Exportar() {
    const data = { tipo: this.tipoBackend };

    this.liquidacionService.exportarExcel(data).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `liquidaciones_${this.tipoBackend}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        //this.notifier('Archivo exportado correctamente');
      },
      error: (err) => {
        console.error('Error exportando Excel:', err);
        //this.notifier('Error al exportar Excel');
      },
    });
  }
}
