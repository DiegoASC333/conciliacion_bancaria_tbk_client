import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import {
  ButtonModule,
  GridModule,
  CardModule,
  LoadingButtonModule,
  PaginationModule,
  SpinnerModule,
} from '@coreui/angular-pro';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DescargaExcelComponent } from './descarga-excel.component';
import { CustomTableModule } from '../components/custom-table/custom-table.module';
import { DescargaExcelRoutingModule } from '../descarga-excel/descarga-excel-routing.module';
import { DescargaExcelService } from '../../services/descarga-excel.service';

@NgModule({
  imports: [
    CustomTableModule,
    IconModule,
    CommonModule,
    GridModule,
    CardModule,
    ButtonModule,
    LoadingButtonModule,
    DescargaExcelRoutingModule,
    PaginationModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
  ],
  declarations: [DescargaExcelComponent],
  providers: [DescargaExcelService],
})
export class DescargaExcelModule {}
