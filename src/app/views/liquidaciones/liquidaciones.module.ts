import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { ButtonModule, GridModule } from '@coreui/angular-pro';
import { LiquidacionesComponent } from './liquidaciones.component';
import { CustomTableModule } from '../components/custom-table/custom-table.module';
import { LiquidacionesRoutingModule } from './liquidaciones-routing.module';
import { LiquidacionServiceService } from '../../services/liquidacion-service.service';

@NgModule({
  imports: [
    LiquidacionesRoutingModule,
    CustomTableModule,
    IconModule,
    GridModule,
    CommonModule,
    ButtonModule,
  ],
  declarations: [LiquidacionesComponent],
  providers: [LiquidacionServiceService],
})
export class LiquidacionModule {}
