import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRefferalComponent } from './account-refferal.component';
import { AccountRefferalRoutingModule } from './account-user-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, AccountRefferalRoutingModule, SharedModule],
    declarations: [AccountRefferalComponent],
})
export class AccountRefferalModule {}
