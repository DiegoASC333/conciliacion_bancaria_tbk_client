import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import {
  ButtonModule,
  GridModule,
  CardModule,
  DropdownModule,
  SharedModule,
  DatePickerModule,
  ModalModule,
} from '@coreui/angular-pro';
import { TbkRegistrosModule } from '../tbk-registros/tbk-registros.module';
import { StatusCuadraturaComponent } from './status-cuadratura.component';
import { StatusCuadraturaRoutingModule } from './status-cuadratura-routing.module';
import { StatusCuadraturaService } from '../../services/status-cuadratura.service';
import { TbkRegistrosComponent } from '../tbk-registros/tbk-registros.component';
import { CustomTableModule } from '../components/custom-table/custom-table.module';
@NgModule({
  imports: [
    CommonModule,
    StatusCuadraturaRoutingModule,
    IconModule,
    ButtonModule,
    GridModule,
    CardModule,
    TbkRegistrosModule,
    CustomTableModule,
    ModalModule,
    DropdownModule,
    SharedModule,
    DatePickerModule,
  ],
  declarations: [StatusCuadraturaComponent, TbkRegistrosComponent],
  providers: [StatusCuadraturaService],
})
export class StatusCuadraturaModule {}
