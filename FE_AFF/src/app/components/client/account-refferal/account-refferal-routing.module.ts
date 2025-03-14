import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountRefferalComponent } from './account-refferal.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AccountRefferalComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class AccountRefferalRoutingModule {}
