import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualPaymentComponent } from './manual-payment.component';
import { ManualPaymentRoutingModule } from './manual-payment-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, ManualPaymentRoutingModule, SharedModule],
    declarations: [ManualPaymentComponent],
})
export class ManualPaymentModule {}
