import { WithdrawComponent } from './withdraw.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: WithdrawComponent }]),
    ],
    exports: [RouterModule],
})
export class WithDrawRoutingModule {}
