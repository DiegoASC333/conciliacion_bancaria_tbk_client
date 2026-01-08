import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { ModalModule } from '@coreui/angular-pro';
import { CustomTableModule } from '../components/custom-table/custom-table.module';
import { DetalleRegistroRoutingModule } from '../detalle-registro/detalle-registro-routing.module';
import { DetalleRegistroService } from '../../services/detalle-registro.service';

@NgModule({
  imports: [CommonModule, IconModule, CustomTableModule, ModalModule, DetalleRegistroRoutingModule],
  declarations: [],
  providers: [DetalleRegistroService],
})
export class DetalleRegistroModule {}
