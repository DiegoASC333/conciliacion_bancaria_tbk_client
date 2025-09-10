import { Component, Input } from '@angular/core';
import { DetalleRegistroService } from '../../services/detalle-registro.service';

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
  detallesRut: any[] = [];

  constructor(private detalleRegistroService: DetalleRegistroService) {}

  ngOnInit() {}

  data: any = {
    rut: this.rut,
    tipo: this.tipo,
  };

  cargarDataRut(data: any) {
    this.detalleRegistroService.getDataHistorial(data).subscribe(
      (res: any) => {
        if (res.status === 200 && res?.data) {
          this.detallesRut = data;
        } else {
          console.log('error');
        }
      },
      (err) => console.error('HTTP error', err)
    );
  }
}
