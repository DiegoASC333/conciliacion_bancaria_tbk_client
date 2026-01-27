import { Component } from '@angular/core';
import { DescargaExcelService } from '../../services/descarga-excel.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-descarga-excel',
  templateUrl: './descarga-excel.component.html',
  styleUrls: ['./descarga-excel.component.scss'],
})
export class DescargaExcelComponent {
  totalesDiariosExcel: any[] = [];
  totalesAgrupados: any[] = [];
  headersCodigosDinamicos: string[] = [];
  totalColumnas: number = 5;
  totalesPaginados: any[] = [];
  itemsPorPagina: number = 5;
  paginaActual: number = 1;
  totalPaginas: number = 1;
  mesSeleccionado: string = '';
  isLoading: boolean = false;
  isExporting: boolean = false;

  constructor(
    private descargaExcelService: DescargaExcelService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {}

  cargarDatosDelMes() {
    if (!this.mesSeleccionado) {
      this.notifier.notify('error', 'Por favor, seleccione un mes.');
      return;
    }

    const [anio, mes] = this.mesSeleccionado.split('-').map(Number);

    const fecha_inicio = `01/${mes.toString().padStart(2, '0')}/${anio}`;

    const ultimoDia = new Date(anio, mes, 0).getDate();
    const fecha_fin = `${ultimoDia}/${mes.toString().padStart(2, '0')}/${anio}`;

    this.GetTotalesExcel(fecha_inicio, fecha_fin);
  }

  procesarDatosParaTabla(data: any[]): any[] {
    const agrupados = new Map<
      string,
      {
        fecha: string;
        credito: { total: number };
        debito: {
          total: number;
          comercios: { codigo: string; nombre: string; total: number }[];
        };
      }
    >();

    for (const item of data) {
      const fecha = new Date(item.FECHA_REAL).toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      if (!agrupados.has(fecha)) {
        agrupados.set(fecha, {
          fecha: fecha,
          credito: { total: 0 },
          debito: {
            total: 0,
            comercios: [],
          },
        });
      }

      const dia = agrupados.get(fecha)!;

      if (item.TIPO === 'CREDITO') {
        dia.credito.total += item.TOTAL_MONTO;
      } else if (item.TIPO === 'DEBITO') {
        dia.debito.total += item.TOTAL_MONTO;
        if (item.CODIGO_COMERCIO) {
          dia.debito.comercios.push({
            codigo: item.CODIGO_COMERCIO,
            nombre: item.NOMBRE_COMERCIO,
            total: item.TOTAL_MONTO,
          });
        }
      }
    }
    return Array.from(agrupados.values());
  }

  GetTotalesExcel(fecha_inicio: string, fecha_fin: string) {
    const data = {
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
    };

    this.descargaExcelService.getDataDescargaExcel(data).subscribe({
      next: (res: any) => {
        if (res.status === 200 && res.data && res.data.length > 0) {
          this.totalesAgrupados = this.procesarDatosParaTabla(res.data);
          let maxCodigos = 0;
          if (this.totalesAgrupados.length > 0) {
            maxCodigos = Math.max(
              ...this.totalesAgrupados.map((dia) => dia.debito.comercios.length)
            );
          }
          this.headersCodigosDinamicos = [];
          for (let i = 1; i <= maxCodigos; i++) {
            this.headersCodigosDinamicos.push(`Comercio ${i}`);
          }
          if (maxCodigos === 0) {
            this.headersCodigosDinamicos.push('Comercio');
          }
          this.totalColumnas = 4 + this.headersCodigosDinamicos.length;
          this.actualizarPagina();
          this.notifier.notify('success', 'Datos cargados correctamente');
        } else {
          this.totalesDiariosExcel = [];
          this.totalesAgrupados = [];
          this.headersCodigosDinamicos = ['Código de comercio']; // Uno por defecto
          this.totalColumnas = 5;
          this.totalesPaginados = [];

          this.totalPaginas = 1;
          this.notifier.notify('warning', 'No existen datos para la fecha seleccionada');
        }
      },
      error: (err) => {
        this.notifier.notify('error', 'Error al cargar los datos:' + err.message);
      },
    });
  }

  actualizarPagina() {
    const indiceInicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const indiceFin = indiceInicio + this.itemsPorPagina;
    this.totalesPaginados = this.totalesAgrupados.slice(indiceInicio, indiceFin);
  }
  onPageChange(pagina: number) {
    this.paginaActual = pagina;
    this.actualizarPagina();
  }

  descargarExcel(item: any) {
    if (this.isLoading) return;

    this.isLoading = true;

    const fechaFormateada = item.fecha.replace(/-/g, '/');

    const data = {
      fecha: fechaFormateada,
    };

    this.descargaExcelService.descargarExcelPorDia(data).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        //a.download = `totales_${item.fecha}.xlsx`;
        const nombreArchivoFecha = item.fecha.replace(/-/g, '.');
        a.download = `totales_${nombreArchivoFecha}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.notifier.notify('success', 'Excel creado con exito');
        this.isLoading = false;
      },
      error: (err) => {
        if (err.error instanceof Blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            try {
              const parsedError = JSON.parse(reader.result as string);
              this.notifier.notify('warning', parsedError.mensaje);
            } catch (e) {
              this.notifier.notify('error', 'Error al procesar la respuesta del servidor.');
            }
          };
          reader.readAsText(err.error);
          this.isLoading = false;
        } else {
          this.notifier.notify('error', 'Error al exportar el archivo.');
          this.isLoading = false;
        }
        console.error('Error exportando Excel:', err);
      },
    });
  }
}
