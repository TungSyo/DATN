import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [
        CommonModule,
        PaymentRoutingModule,
        SharedModule,
        ReactiveFormsModule,
    ],
    declarations: [PaymentComponent],
})
export class PaymentModule {}
