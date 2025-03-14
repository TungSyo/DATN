import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRefferalComponent } from './account-refferal.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AccountRefferalRoutingModule } from './account-refferal-routing.module';

@NgModule({
    imports: [CommonModule, SharedModule, AccountRefferalRoutingModule],
    declarations: [AccountRefferalComponent],
})
export class AccountRefferalModule {}
