import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartolaTbkService } from '../../services/cartola-tbk.service';
import { formatFechaAny, formatCLP } from '../../utils/utils';

@Component({
  selector: 'app-cartola-tbk',
  templateUrl: './cartola-tbk.component.html',
  styleUrls: ['./cartola-tbk.component.scss'],
})
export class CartolaTbkComponent implements OnInit {
  tipo: string = '';
  titulo: string = '';
  registrosTbk: any[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  totalesTbk: { saldoEstimado: number; saldoPorCobrar: number } | null = null;

  constructor(
    private route: ActivatedRoute,
    private cartolaTbkSerive: CartolaTbkService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const p = params['tipo'];
      // Limpio los datos anteriores
      this.registrosTbk = [];
      this.totalesTbk = null;
      if (p === 'credito') {
        this.tipo = 'LCN';
        this.titulo = 'Crédito';
      } else if (p === 'debito') {
        this.tipo = 'LDN';
        this.titulo = 'Débito';
      } else {
        this.tipo = '';
        this.titulo = '';
      }
    });
  }

  // Formatea a ddMMyyyy
  private toOracleStr(d: Date | null): string {
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}${mm}${yyyy}`;
  }

  cargarCartola() {
    if (!this.tipo) return;
    if (!this.startDate || !this.endDate) return;

    if (this.startDate > this.endDate) {
      [this.startDate, this.endDate] = [this.endDate, this.startDate];
    }

    const data: any = {
      tipo: this.tipo,
      start: this.toOracleStr(this.startDate),
      end: this.toOracleStr(this.endDate),
    };

    this.cartolaTbkSerive.getCartola(data).subscribe(
      (res: any) => {
        if (res.status === 200 && res.data) {
          // Accede a la propiedad 'detalle_transacciones' para los registros
          if (Array.isArray(res.data.detalle_transacciones)) {
            this.registrosTbk = res.data.detalle_transacciones.map((r: any) => ({
              ...r,
              FECHA_VENTA: formatFechaAny(r.FECHA_VENTA),
              FECHA_ABONO: formatFechaAny(r.FECHA_ABONO),
              MONTO: formatCLP(r.MONTO),
              DEUDA_PAGADA: formatCLP(r.DEUDA_PAGADA),
              DEUDA_POR_PAGAR: formatCLP(r.DEUDA_POR_PAGAR),
              TOTAL_CUOTAS: r.TOTAL_CUOTAS ?? null,
              CUOTAS_RESTANTES: r.CUOTAS_RESTANTES ?? null,
            }));

            console.log(this.registrosTbk, 'aca pasa el array');
          } else {
            this.registrosTbk = [];
          }

          if (res.data.totales && res.data.totales.length > 0) {
            this.totalesTbk = res.data.totales?.[0]
              ? {
                  saldoEstimado: res.data.totales[0].SALDO_ESTIMADO,
                  saldoPorCobrar: res.data.totales[0].SALDO_POR_COBRAR,
                }
              : null;
          } else {
            // Maneja el caso en que no haya totales
            this.totalesTbk = null;
          }
        } else {
          this.registrosTbk = [];
          this.totalesTbk = null;
          console.log('error');
        }
      },
      (err) => {
        this.registrosTbk = [];
        this.totalesTbk = null;
        console.error('HTTP error', err);
      }
    );
  }

  getCartolaCredito() {
    this.tipo = 'LCN';
    this.titulo = 'Crédito';
    const data = {
      tipo: this.tipo,
    };

    this.cartolaTbkSerive.getCartola(data).subscribe(
      (res: any) => {
        if (res.status === 200 && res?.data) {
          this.registrosTbk = res.data;
        } else {
          console.log('error');
        }
      },
      (err) => console.error('HTTP error', err)
    );
  }

  onDateChange() {
    // Si prefieres carga automática al cambiar fechas:
    // if (this.startDate && this.endDate) this.cargarCartola();
  }

  getCartolaDebito() {
    this.tipo = 'LDN';
    this.titulo = 'Débito';

    const data = {
      tipo: this.tipo,
    };

    this.cartolaTbkSerive.getCartola(data).subscribe(
      (res: any) => {
        if (res.status === 200 && res?.data) {
          this.registrosTbk = res.data;
        } else {
          console.log('error');
        }
      },
      (err) => console.error('HTTP error', err)
    );
  }
}
