import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleRegistroComponent } from './detalle-registro.component';

const routes: Routes = [
  {
    path: '',
    component: DetalleRegistroComponent,
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
export class DetalleRegistroRoutingModule {}
