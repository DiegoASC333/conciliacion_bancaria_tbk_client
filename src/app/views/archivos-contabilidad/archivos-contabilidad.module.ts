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
import { ArchivosContabilidadComponent } from './archivos-contabilidad.component';
import { ArchivosContabilidadRoutingModule } from './archivos-contabilidad-routing.module';

@NgModule({
  imports: [
    ArchivosContabilidadRoutingModule,
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
  declarations: [ArchivosContabilidadComponent],
  providers: [],
})
export class ArchivosContabilidadModule {}
