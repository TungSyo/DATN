import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithdrawComponent } from './withdraw.component';
import { WithDrawRoutingModule } from './withdraw-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, WithDrawRoutingModule, ReactiveFormsModule],
    declarations: [WithdrawComponent],
})
export class WithdrawModule {}
