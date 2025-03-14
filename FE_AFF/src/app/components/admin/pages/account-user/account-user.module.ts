import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountUserComponent } from './account-user.component';
import { AccountUserRoutingModule } from './account-user-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, AccountUserRoutingModule, SharedModule],
    declarations: [AccountUserComponent],
})
export class AccountUserModule {}
