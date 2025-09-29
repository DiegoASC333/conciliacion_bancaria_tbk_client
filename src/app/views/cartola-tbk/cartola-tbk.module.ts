import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import {
  ButtonModule,
  CalendarComponent,
  CalendarModule,
  GridModule,
  DateRangePickerModule,
  DropdownModule,
  SharedModule,
  ModalModule,
} from '@coreui/angular-pro';
import { CartolaTbkComponent } from './cartola-tbk.component';
import { CustomTableModule } from '../components/custom-table/custom-table.module';
import { CartolaTbkRoutingModule } from './cartola-tbk-routing.module';
import { CartolaTbkService } from '../../services/cartola-tbk.service';
import { DetalleRegistroModule } from '../detalle-registro/detalle-registro.module';
import { DetalleRegistroComponent } from '../detalle-registro/detalle-registro.component';

@NgModule({
  imports: [
    CartolaTbkRoutingModule,
    CustomTableModule,
    IconModule,
    CommonModule,
    ButtonModule,
    ModalModule,
    CalendarComponent,
    CalendarModule,
    GridModule,
    DateRangePickerModule,
    DropdownModule,
    SharedModule,
    DetalleRegistroModule,
  ],
  declarations: [CartolaTbkComponent, DetalleRegistroComponent],
  providers: [CartolaTbkService],
})
export class CartolaTbkModule {}
