import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DetalleRegistroService } from '../../services/detalle-registro.service';
@Component({
  selector: 'app-detalle-registro',
  templateUrl: './detalle-registro.component.html',
  styleUrls: ['./detalle-registro.component.scss'],
})
export class DetalleRegistroComponent {
  @Input() rut!: string;
  @Input() tipo!: string;
  @Input() cuota!: number;
  @Input() cupon!: string;
  @Input() modalHistorialRut: boolean = false;
  @Input() visible: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() reprocesar = new EventEmitter<any>();
  detallesRut: any[] = [];

  //cupon: string;
  nombre: string = '';
  rutCliente: string = '';
  totalAbonado: number = 0;
  fechaVenta: string = '';
  saldoPorCobrar: number = 0;
  ventaTotal: number = 0;
  cuotasRestantes: number = 0;

  constructor(private detalleRegistroService: DetalleRegistroService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['modalHistorialRut']) {
      if (this.modalHistorialRut === true) {
        const shouldLoad = !!this.rut && !!this.cupon && !!this.tipo;

        if (shouldLoad) {
          this.cargarDataRut({
            rut: this.rut,
            cupon: this.cupon,
            tipo: this.tipo,
          });
        } else {
          console.warn('HIJO: Modal abierto pero faltan datos (rut, cupon, o tipo).');
        }
      } else {
        this.resetInternalState();
      }
    }
  }

  cargarDataRut(data: { rut: string; cupon: string; tipo: string }) {
    this.detalleRegistroService.getDataHistorial(data).subscribe({
      next: (res: any) => {
        if (res && res.success && res.status === 200 && Array.isArray(res.data)) {
          const historial: any[] = res.data;

          if (historial.length === 0) {
            this.detallesRut = [];
            return;
          }

          this.detallesRut = historial.map((item: any) => {
            const estaPagada = item.CUOTA_PAGADA <= this.cuota;
            return {
              'Fecha abono': item.FECHA_ABONO,
              'Monto Cuota': item.MONTO,
              'Cuota pagada': item.CUOTA_PAGADA,
              'Total cuotas': item.TOTAL_CUOTAS,
              PAGADO: estaPagada ? 'SI' : 'NO',
            };
          });

          const primer = historial[0];

          this.nombre = primer.NOMBRE;
          this.rutCliente = primer.RUT;
          this.fechaVenta = primer.FECHA_VENTA;

          const montoCuota = primer.MONTO;
          const totalCuotas = primer.TOTAL_CUOTAS;

          this.ventaTotal = montoCuota * totalCuotas;
          this.cuotasRestantes = totalCuotas - this.cuota;
          this.totalAbonado = montoCuota * this.cuota;
          this.saldoPorCobrar = this.cuotasRestantes * montoCuota;
        } else {
          this.detallesRut = [];
        }
      },
      error: (err) => {
        this.detallesRut = [];
        console.error('Error al cargar historial', err);
      },
    });
  }

  resetInternalState() {
    this.detallesRut = [];
    this.nombre = '';
    this.rutCliente = '';
    this.totalAbonado = 0;
    this.saldoPorCobrar = 0;
    this.ventaTotal = 0;
    this.cuotasRestantes = 0;
    this.fechaVenta = '';
  }

  close() {
    this.closeModal.emit();
    // this.detallesRut = [];
    // this.nombre = '';
    // this.rutCliente = '';
    // this.totalAbonado = 0;
    // this.saldoPorCobrar = 0;
    // this.ventaTotal = 0;
    // this.cuotasRestantes = 0;
    // this.cuota = 0;
  }
}
