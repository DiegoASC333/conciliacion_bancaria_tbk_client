import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import {
  ButtonModule,
  CalendarComponent,
  CalendarModule,
  GridModule,
  CardModule,
  DateRangePickerModule,
  DropdownModule,
  SharedModule,
  ModalModule,
  WidgetModule,
  SpinnerModule,
  LoadingButtonModule,
} from '@coreui/angular-pro';
import { CustomTableModule } from '../components/custom-table/custom-table.module';
import { ReporteVentaComponent } from './reporte-venta.component';
import { ReporteVentaRoutingModule } from './reporte-venta-routing.module';
import { ReporteVentaService } from '../../services/reporte-venta.service';

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    CardModule,
    CustomTableModule,
    ButtonModule,
    DateRangePickerModule,
    ButtonModule,
    CalendarComponent,
    CalendarModule,
    GridModule,
    DateRangePickerModule,
    DropdownModule,
    SharedModule,
    ModalModule,
    WidgetModule,
    SpinnerModule,
    LoadingButtonModule,
    ReporteVentaRoutingModule,
  ],
  declarations: [ReporteVentaComponent],
  providers: [ReporteVentaService],
})
export class ReporteVentaModule {}
