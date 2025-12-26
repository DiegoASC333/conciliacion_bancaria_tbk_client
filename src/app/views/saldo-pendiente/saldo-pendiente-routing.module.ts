import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaldoPendienteComponent } from './saldo-pendiente.component';

const routes: Routes = [
  {
    path: '',
    component: SaldoPendienteComponent,
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
export class SaldoPendienteRoutingModule {}
