import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WithdrawComponent } from './withdraw.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: WithdrawComponent }]),
    ],
    exports: [RouterModule],
})
export class WithDrawRoutingModule {}
