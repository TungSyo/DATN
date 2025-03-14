import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResendEmailOtpComponent } from './resend-email-otp.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ResendEmailOtpComponent }
  ])],
  exports: [RouterModule]
})
export class ResendEmailOtpRoutingModule { }
