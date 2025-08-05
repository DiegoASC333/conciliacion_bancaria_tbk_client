import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomTableComponent } from './custom-table.component';

const routes: Routes = [
  {
    path: '',
    component: CustomTableComponent,
    data: {
      title: 'Custom Table',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomRoutingModule {}
