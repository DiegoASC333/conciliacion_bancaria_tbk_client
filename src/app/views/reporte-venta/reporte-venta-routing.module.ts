import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteVentaComponent } from './reporte-venta.component';

const routes: Routes = [
  {
    path: '',
    component: ReporteVentaComponent,
    data: {
      title: '',
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ReporteVentaRoutingModule {}
