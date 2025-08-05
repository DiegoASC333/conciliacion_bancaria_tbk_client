import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomModalComponent } from './custom-modal.component';
import path from 'path';

const routes: Routes = [
  {
    path: '',
    component: CustomModalComponent,
    data: {
      title: 'Custom Modal',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomModalRoutingModule {}
