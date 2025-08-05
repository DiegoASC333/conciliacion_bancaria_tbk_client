import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusCuadraturaComponent } from './status-cuadratura.component';

const routes: Routes = [
  {
    path: '',
    component: StatusCuadraturaComponent,
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
export class StatusCuadraturaRoutingModule {}
