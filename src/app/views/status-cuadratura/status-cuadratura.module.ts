import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '@coreui/icons-angular';
import { ButtonModule, GridModule, CardModule } from '@coreui/angular-pro';
import { StatusCuadraturaComponent } from './status-cuadratura.component';
import { StatusCuadraturaRoutingModule } from './status-cuadratura-routing.module';

@NgModule({
  imports: [
    CommonModule,
    StatusCuadraturaRoutingModule,
    IconModule,
    ButtonModule,
    GridModule,
    CardModule,
  ],
  declarations: [StatusCuadraturaComponent],
})
export class StatusCuadraturaModule {}
