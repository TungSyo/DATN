import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HistoryAmountComponent } from './history-amount.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: HistoryAmountComponent }]),
    ],
    exports: [RouterModule],
})
export class HistoryAmountRoutingModule {}
