import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { SetPasswordRoutingModule } from './set-password-routing.module';
import { SetPasswordComponent } from './set-password.component';

@NgModule({
  imports: [
    CommonModule,
    SetPasswordRoutingModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    SharedModule
],
declarations: [SetPasswordComponent]
})
export class SetPasswordModule { }
