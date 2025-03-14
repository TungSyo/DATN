import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePaymentComponent } from './create-payment.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { CreatePaymentRoutingModule } from './create-payment-routing.module';

@NgModule({
    imports: [CommonModule, SharedModule, CreatePaymentRoutingModule],
    declarations: [CreatePaymentComponent],
})
export class CreatePaymentModule {}
