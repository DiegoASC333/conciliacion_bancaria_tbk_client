import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng9RutModule } from 'ng9-rut';

import {
  AvatarModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  CollapseModule,
  FormModule,
  GridModule,
  LoadingButtonModule,
  ModalModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SmartTableModule,
  BadgeModule,
  TableModule,
  TabsModule,
} from '@coreui/angular-pro';
import { IconModule } from '@coreui/icons-angular';
import { CustomTableComponent } from './custom-table.component';

@NgModule({
  declarations: [CustomTableComponent],

  imports: [
    AvatarModule,
    BreadcrumbModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    BadgeModule,
    CollapseModule,
    CommonModule,
    FormModule,
    FormsModule,
    GridModule,
    IconModule,
    LoadingButtonModule,
    ModalModule,
    ModalModule,
    NavModule,
    Ng9RutModule,
    ProgressModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    SharedModule,
    SmartTableModule,
    TableModule,
    TableModule,
    TabsModule,
  ],
  exports: [CustomTableComponent],
})
export class CustomTableModule {}
