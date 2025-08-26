import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TbkRegistrosComponent } from './tbk-registros.component';

const routes: Routes = [
  {
    path: '',
    component: TbkRegistrosComponent,
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
export class TbkRegistrosRoutingModule {}
