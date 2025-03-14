import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryAmountComponent } from './history-amount.component';
import { HistoryAmountRoutingModule } from './history-amount-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, HistoryAmountRoutingModule, SharedModule],
    declarations: [HistoryAmountComponent],
})
export class HistoryAmountModule {}
