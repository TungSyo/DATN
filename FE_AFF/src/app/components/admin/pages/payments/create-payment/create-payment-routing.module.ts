import { CreatePaymentComponent } from './create-payment.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild([
            { path: '', component: CreatePaymentComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class CreatePaymentRoutingModule {}
