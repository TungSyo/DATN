import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterReferalComponent } from './register-referal.component';
import { RegisterReferalRoutingModule } from './register-referal-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, RegisterReferalRoutingModule, SharedModule],
    declarations: [RegisterReferalComponent],
})
export class RegisterReferalModule {}
