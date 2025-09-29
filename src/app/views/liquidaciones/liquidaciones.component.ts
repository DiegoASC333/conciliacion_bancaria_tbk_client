import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LiquidacionServiceService } from '../../services/liquidacion-service.service';
import { formatCLP } from '../../utils/utils';
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
  selectedDate: Date = new Date();
  estaValidando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private liquidacionService: LiquidacionServiceService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const tipo = params['tipo'];
      if (tipo) {
        this.setTipo(tipo);
        //this.loadLiquidaciones();
      }
    });
  }

  private setTipo(tipoUrl: string) {
    if (tipoUrl === 'credito') {
      this.tipoBackend = 'LCN';
      this.titulo = 'Crédito';
    } else if (tipoUrl === 'debito') {
      this.tipoBackend = 'LDN';
      this.titulo = 'Débito';
    } else {
      console.error('Tipo de liquidación desconocido:', tipoUrl);
    }

    this.loadLiquidaciones();
  }

  onDateSelected(event: Date | null) {
    if (!event) return;
    this.selectedDate = event;
    this.loadLiquidaciones();
  }

  loadLiquidaciones() {
    this.liquidacionesTbk = [];
    this.totalesPorComercio = [];
    this.totalGeneral = 0;

    if (!this.selectedDate) {
      this.notifier.notify('warning', 'Por favor, selecciona una fecha.');
      return;
    }

    const fechaStr = this.selectedDate.toISOString().split('T')[0];

    const data = {
      tipo: this.tipoBackend,
      fecha: fechaStr,
    };

    console.log('Enviando al backend:', { tipo: this.tipoBackend, fecha: fechaStr });

    this.liquidacionService.getLiquidacion(data).subscribe({
      next: (res: any) => {
        if (res.status === 200 && res.data && res.data.detalles_transacciones?.length > 0) {
          this.liquidacionesTbk = res.data.detalles_transacciones.map((r: any) => {
            const limpio = Object.fromEntries(Object.entries(r).filter(([_, v]) => v !== null));
            return {
              ...limpio,
              TOTAL_ABONADO: formatCLP(r.TOTAL_ABONADO),
              COMISION_NETA: formatCLP(r.COMISION_NETA),
              COMISION_BRUTA: formatCLP(r.COMISION_BRUTA),
            };
          });
          this.notifier.notify('success', 'Liquidación cargada');
          this.totalesPorComercio = res.data.totales_por_comercio;
          this.totalGeneral =
            this.totalesPorComercio?.length > 0
              ? this.totalesPorComercio.reduce(
                  (acc: number, t: any) => acc + (t.TOTAL_MONTO || 0),
                  0
                )
              : 0;
        } else {
          this.liquidacionesTbk = [];
          this.totalesPorComercio = [];
          this.totalGeneral = 0;
          this.notifier.notify('warning', 'No existen datos para la fecha seleccionada');
        }
      },
      error: (err) => {
        this.liquidacionesTbk = [];
        this.totalesPorComercio = [];
        this.totalGeneral = 0;
        this.notifier.notify('error', 'Error al obtener liquidaciones desde el servidor', err);
        console.error(err);
      },
    });
  }

  validarContabilidad(): void {
    if (this.liquidacionesTbk.length === 0) {
      this.notifier.notify('warning', 'No hay transacciones para validar.');
      return;
    }
    this.estaValidando = true;
    const payload = {
      tipo: this.tipoBackend,
      fecha: this.selectedDate.toISOString().split('T')[0],
      usuarioId: '19273978',
    };

    this.liquidacionService.validarLiquidaciones(payload).subscribe({
      next: (response) => {
        this.notifier.notify('success', `Liquidaciones validadas y guardadas.`);
        this.loadLiquidaciones(); // Recargar para limpiar y mostrar el estado actualizado
      },
      error: (err) => {
        this.notifier.notify('error', err.error.mensaje || 'Ocurrió un error al validar.');
        console.error('Error en la validación:', err);
      },
      complete: () => {
        this.estaValidando = false;
      },
    });
  }

  Exportar() {
    const fechaStr = this.selectedDate.toISOString().split('T')[0];
    const data = {
      tipo: this.tipoBackend,
      fecha: fechaStr,
    };

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
