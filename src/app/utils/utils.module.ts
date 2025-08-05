import { NgModule } from '@angular/core';
import { RoleTranslatePipe, ActiveTranslatePipe, StatusTranslatePipe } from './translates.pipe';

@NgModule({
  declarations: [RoleTranslatePipe, ActiveTranslatePipe, StatusTranslatePipe],
  exports: [RoleTranslatePipe, ActiveTranslatePipe, StatusTranslatePipe],
})
export class UtilsModule {}
