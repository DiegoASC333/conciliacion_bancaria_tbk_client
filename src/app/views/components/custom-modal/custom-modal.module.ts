import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import {
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule,
  ModalModule,
  AvatarModule,
  SmartTableModule,
  SharedModule,
  CollapseModule,
} from '@coreui/angular-pro';
import { CustomModalComponent } from './custom-modal.component';

@NgModule({
  declarations: [CustomModalComponent],

  imports: [
    NavModule,
    TabsModule,
    CardModule,
    CommonModule,
    GridModule,
    ProgressModule,
    IconModule,
    ReactiveFormsModule,
    ButtonModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    TableModule,
    ModalModule,
    AvatarModule,
    FormsModule,
    SmartTableModule,
    SharedModule,
    CollapseModule,
  ],
  exports: [CustomModalComponent],
  providers: [IconSetService],
})
export class CustomModalModule {}
