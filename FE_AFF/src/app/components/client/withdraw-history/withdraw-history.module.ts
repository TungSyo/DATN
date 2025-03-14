import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithdrawHistoryComponent } from './withdraw-history.component';
import { WithDrawHistoryRoutingModule } from './withdraw-history-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, WithDrawHistoryRoutingModule, SharedModule],
    declarations: [WithdrawHistoryComponent],
})
export class WithdrawHistoryModule {}
