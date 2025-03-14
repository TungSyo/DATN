import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetPasswordComponent } from './set-password.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: SetPasswordComponent }
  ])],
  exports: [RouterModule]
})
export class SetPasswordRoutingModule { }
