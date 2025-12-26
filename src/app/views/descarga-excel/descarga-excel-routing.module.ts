import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DescargaExcelComponent } from './descarga-excel.component';

const routes: Routes = [
  {
    path: '',
    component: DescargaExcelComponent,
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
export class DescargaExcelRoutingModule {}
