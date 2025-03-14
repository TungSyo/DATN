import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ResendEmailOtpComponent } from './resend-email-otp.component';
import { ResendEmailOtpRoutingModule } from './resend-email-otp-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    ResendEmailOtpRoutingModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    SharedModule
  ],
  declarations: [ResendEmailOtpComponent]
})
export class ResendEmailOtpModule { }
