import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatFechaTbk, formatCLP } from '../../utils/utils';
import { NotifierService } from 'angular-notifier';
import { ReporteVentaService } from '../../services/reporte-venta.service';

@Component({
  selector: 'app-reporte-venta',
  templateUrl: './reporte-venta.component.html',
  styleUrls: ['./reporte-venta.component.scss'],
})
export class ReporteVentaComponent {
  tipo: string = '';
  titulo: string = '';
  ventasTbk: any[] = [];
  totalVentas: number = 0;
  startDate: Date | null = null;
  endDate: Date | null = null;
  tipoBackend: string = '';
  resumenVentas: any[] = []; // Nueva variable

  constructor(
    private route: ActivatedRoute,
    private notifier: NotifierService,
    private reporteVentaService: ReporteVentaService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.ventasTbk = [];
      this.resumenVentas = [];
      this.totalVentas = 0;

      const p = params['tipo'];
      if (p === 'credito') {
        this.tipo = 'CCN';
        this.titulo = 'Crédito';
        this.tipoBackend = 'CCN';
      } else if (p === 'debito') {
        this.tipo = 'CDN';
        this.titulo = 'Débito';
        this.tipoBackend = 'CDN';
      } else {
        this.tipo = '';
        this.titulo = '';
      }

      this.loadData();
    });
  }

  loadData() {
    if (!this.tipo || !this.startDate || !this.endDate) {
      return;
    }

    try {
      if (this.startDate > this.endDate) {
        [this.startDate, this.endDate] = [this.endDate, this.startDate];
      }

      const payload = {
        tipo: this.tipoBackend,
        start: new Date(this.startDate).toISOString().split('T')[0],
        end: new Date(this.endDate).toISOString().split('T')[0],
      };

      this.reporteVentaService.getReporteVentas(payload).subscribe({
        next: (res: any) => {
          if (res.status === 200 && res.data) {
            if (Array.isArray(res.data) && res.data.length > 0) {
              this.ventasTbk = res.data.map((r: any) => {
                return {
                  ...r,
                  FECHA_VENTA: formatFechaTbk(r.FECHA_VENTA),
                  MONTO_VENTA: formatCLP(r.MONTO_VENTA),
                };
              });

              this.totalVentas = res.total;
              this.notifier.notify('success', 'Reporte cargado correctamente');

              if (res.resumenDocumentos) {
                this.resumenVentas = Object.keys(res.resumenDocumentos).map((key) => ({
                  tipoDoc: key,
                  monto: res.resumenDocumentos[key],
                }));
              } else {
                this.resumenVentas = [];
              }
            } else {
              this.limpiarDatos('No existen datos para el periodo seleccionado', 'warning');
            }
          }
        },
        error: (err) => {
          this.notifier.notify('error', 'Error al cargar el reporte');
        },
      });
    } catch (e) {
      console.error('Error al formatear fechas:', e);
    }
  }

  onDateChange() {
    this.loadData();
  }

  cargarCartola() {
    this.loadData();
  }

  limpiarDatos(mensaje: string, tipoNotificacion: string) {
    this.ventasTbk = [];
    this.totalVentas = 0;
    this.resumenVentas = [];
    this.notifier.notify(tipoNotificacion, mensaje);
  }

  Exportar() {
    if (!this.tipo || !this.startDate || !this.endDate) {
      return;
    }

    try {
      if (this.startDate > this.endDate) {
        [this.startDate, this.endDate] = [this.endDate, this.startDate];
      }

      const payload = {
        tipo: this.tipoBackend,
        start: new Date(this.startDate).toISOString().split('T')[0],
        end: new Date(this.endDate).toISOString().split('T')[0],
      };

      this.reporteVentaService.exportarExcel(payload).subscribe({
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

          a.download = `Reporte_Venta_${this.tipoBackend}_${fecha}.xlsx`;

          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.notifier.notify('success', 'Excel creado con exito');
        },
        error: (err) => {
          //console.error('Error exportando Excel:', err);
          this.notifier.notify('error', 'Error al generar el Excel', err);
        },
      });
    } catch (e) {
      console.error('Error al formatear fechas:', e);
    }
  }
}
