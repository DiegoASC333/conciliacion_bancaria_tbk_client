import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DetalleRegistroService } from '../../services/detalle-registro.service';

interface HistorialItem {
  cupon_Credito: number;
  rut: string;
  fecha_venta: string;
  fecha_abono: string;
  cuota_pagada: number;
  TOTAL_CUOTAS: number;
  monto: number;
  nombre: string;
  cuotas_restantes: number;
  deuda_pagada: number;
  deuda_por_pagar: number;
}

@Component({
  selector: 'app-detalle-registro',
  templateUrl: './detalle-registro.component.html',
  styleUrls: ['./detalle-registro.component.scss'],
})
export class DetalleRegistroComponent {
  @Input() rut!: string;
  @Input() tipo!: string;
  @Input() modalHistorialRut: boolean = false;
  @Input() visible: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() reprocesar = new EventEmitter<any>();
  detallesRut: any[] = [];

  cupon: any;
  nombre: string = '';
  rutCliente: string = '';
  totalAbonado: number = 0;
  saldoPorCobrar: number = 0;
  ventaTotal: number = 0;
  cuotasRestantes: number = 0;

  constructor(private detalleRegistroService: DetalleRegistroService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    // Cuando se abra el modal y tengamos rut definido
    if (changes['modalHistorialRut'] && this.modalHistorialRut && this.rut) {
      this.cargarDataRut({ rut: this.rut, tipo: this.tipo });
    }
  }

  cargarDataRut(data: { rut: string; tipo: string }) {
    this.detalleRegistroService.getDataHistorialMock(data).subscribe(
      (res: HistorialItem[]) => {
        if (!res || res.length === 0) {
          this.detallesRut = [];
          return;
        }

        // Mapeamos solo las columnas que van a la tabla y renombramos para headers
        this.detallesRut = res.map((item: HistorialItem) => ({
          'Fecha abono': item.fecha_abono,
          'Fecha venta': item.fecha_venta,
          'Cuota pagada': item.cuota_pagada,
          'Total cuotas': item.TOTAL_CUOTAS,
        }));

        const primer = res[0];
        this.cupon = primer.cupon_Credito;
        this.nombre = primer.nombre;
        this.rutCliente = primer.rut;

        this.totalAbonado = res.reduce((acc: number, r: HistorialItem) => acc + r.deuda_pagada, 0);
        this.saldoPorCobrar = res.reduce(
          (acc: number, r: HistorialItem) => acc + r.deuda_por_pagar,
          0
        );
        this.ventaTotal = res.reduce((acc: number, r: HistorialItem) => acc + r.monto, 0);
        this.cuotasRestantes = res.reduce(
          (acc: number, r: HistorialItem) => acc + r.cuotas_restantes,
          0
        );
      },
      (err) => console.error('HTTP error', err)
    );
  }

  close() {
    this.closeModal.emit();
    this.detallesRut = [];
  }
}
