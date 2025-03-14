import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserInfomationComponent } from './user-infomation.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: UserInfomationComponent }])],
    exports: [RouterModule],
})
export class UserInfomationRoutingModule { }
