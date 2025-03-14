import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithdrawComponent } from './withdraw.component';
import { WithDrawRoutingModule } from './withdraw-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, WithDrawRoutingModule, SharedModule],
    declarations: [WithdrawComponent],
})
export class WithdrawModule {}
