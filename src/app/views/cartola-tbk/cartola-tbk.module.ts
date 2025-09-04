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
} from '@coreui/angular-pro';
import { CartolaTbkComponent } from './cartola-tbk.component';
import { CustomTableModule } from '../components/custom-table/custom-table.module';
import { CartolaTbkRoutingModule } from './cartola-tbk-routing.module';
import { CartolaTbkService } from '../../services/cartola-tbk.service';

@NgModule({
  imports: [
    CartolaTbkRoutingModule,
    CustomTableModule,
    IconModule,
    CommonModule,
    ButtonModule,
    CalendarComponent,
    CalendarModule,
    GridModule,
    DateRangePickerModule,
    DropdownModule,
    SharedModule,
  ],
  declarations: [CartolaTbkComponent],
  providers: [CartolaTbkService],
})
export class CartolaTbkModule {}
