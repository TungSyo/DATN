import { PaymentComponent } from './payment.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: PaymentComponent }]),
    ],
    exports: [RouterModule],
})
export class PaymentRoutingModule {}
