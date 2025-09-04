import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartolaTbkComponent } from './cartola-tbk.component';

const routes: Routes = [
  {
    path: '',
    component: CartolaTbkComponent,
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
export class CartolaTbkRoutingModule {}
