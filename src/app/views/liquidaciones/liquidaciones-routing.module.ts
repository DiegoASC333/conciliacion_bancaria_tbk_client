import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidacionesComponent } from './liquidaciones.component';

const routes: Routes = [
  {
    path: '',
    component: LiquidacionesComponent,
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
export class LiquidacionesRoutingModule {}
