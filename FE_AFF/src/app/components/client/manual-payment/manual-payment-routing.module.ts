import { ManualPaymentComponent } from './manual-payment.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ManualPaymentComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ManualPaymentRoutingModule {}
