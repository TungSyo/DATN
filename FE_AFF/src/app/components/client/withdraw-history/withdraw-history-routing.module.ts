import { WithdrawHistoryComponent } from './withdraw-history.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: WithdrawHistoryComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class WithDrawHistoryRoutingModule {}
