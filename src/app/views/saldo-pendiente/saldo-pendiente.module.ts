import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import {
  ButtonModule,
  GridModule,
  CardModule,
  LoadingButtonModule,
  PaginationModule,
  DatePickerModule,
  WidgetModule,
  SpinnerModule,
} from '@coreui/angular-pro';
import { SaldoPendienteComponent } from './saldo-pendiente.component';
import { CustomTableModule } from '../components/custom-table/custom-table.module';
import { SaldoPendienteRoutingModule } from './saldo-pendiente-routing.module';
import { SaldoPendienteService } from '../../services/saldo-pendiente.service';

@NgModule({
  imports: [
    CustomTableModule,
    IconModule,
    CommonModule,
    GridModule,
    CardModule,
    ButtonModule,
    LoadingButtonModule,
    SaldoPendienteRoutingModule,
    PaginationModule,
    DatePickerModule,
    WidgetModule,
    SpinnerModule,
  ],
  declarations: [SaldoPendienteComponent],
  providers: [SaldoPendienteService],
})
export class SaldoPendienteModule {}
