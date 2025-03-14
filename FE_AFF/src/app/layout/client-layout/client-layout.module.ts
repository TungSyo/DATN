import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientLayoutComponent } from './client-layout.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { OtpComponent } from 'src/app/components/client/auth/otp/otp.component';
import { SidebarComponent } from './sidebar/sidebar.component';
// import { InputOtpModule } from 'primeng/inputotp';
@NgModule({
    imports: [CommonModule, RouterModule, ReactiveFormsModule, SharedModule],
    declarations: [
        ClientLayoutComponent,
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
    ],
})
export class ClientLayoutModule {}
