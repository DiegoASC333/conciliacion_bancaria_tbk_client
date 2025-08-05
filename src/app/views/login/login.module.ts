import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonModule, CardModule, FormModule, GridModule, AlertModule } from '@coreui/angular-pro';
import { IconModule } from '@coreui/icons-angular';

import { LoginComponent } from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    GridModule,
    IconModule,
    FormModule,
    ReactiveFormsModule,
    AlertModule,
  ],
})
export class LoginModule {}
