import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import {
  ButtonModule,
  GridModule,
  CardModule,
  SmartTableModule,
  TableModule,
  TabsModule,
  ModalModule,
} from '@coreui/angular-pro';
import { TbkRegistrosRoutingModule } from './tbk-registros-routing.module';
import { CustomTableModule } from '../components/custom-table/custom-table.module';

@NgModule({
  imports: [
    CommonModule,
    TbkRegistrosRoutingModule,
    IconModule,
    GridModule,
    ButtonModule,
    CardModule,
    CustomTableModule,
    SmartTableModule,
    TableModule,
    TabsModule,
    ModalModule,
  ],
  declarations: [],
})
export class TbkRegistrosModule {}
