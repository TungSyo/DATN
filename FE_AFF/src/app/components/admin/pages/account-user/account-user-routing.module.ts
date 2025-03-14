import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountUserComponent } from './account-user.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: AccountUserComponent }]),
    ],
    exports: [RouterModule],
})
export class AccountUserRoutingModule {}
