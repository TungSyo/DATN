import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserInfomationComponent } from './user-infomation.component';
import { UserInfomationRoutingModule } from './user-infomation-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        UserInfomationRoutingModule,
        ReactiveFormsModule,
    ],
    declarations: [UserInfomationComponent],
})
export class UserInfomationModule {}
