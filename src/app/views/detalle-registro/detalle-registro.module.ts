import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import {
  ButtonModule,
  CalendarComponent,
  CalendarModule,
  GridModule,
  ModalModule,
  DateRangePickerModule,
  DropdownModule,
  SharedModule,
} from '@coreui/angular-pro';
//import { DetalleRegistroComponent } from './detalle-registro.component';
import { CustomTableModule } from '../components/custom-table/custom-table.module';
import { DetalleRegistroRoutingModule } from '../detalle-registro/detalle-registro-routing.module';
import { DetalleRegistroService } from '../../services/detalle-registro.service';

@NgModule({
  imports: [CommonModule, IconModule, CustomTableModule, ModalModule, DetalleRegistroRoutingModule],
  declarations: [],
  providers: [DetalleRegistroService],
})
export class DetalleRegistroModule {}
