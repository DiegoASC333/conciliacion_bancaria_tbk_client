import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchivosContabilidadComponent } from './archivos-contabilidad.component';

const routes: Routes = [
  {
    path: '',
    component: ArchivosContabilidadComponent,
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
export class ArchivosContabilidadRoutingModule {}
