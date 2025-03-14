import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCommissionsAccountComponent } from './list-commissions-account.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ListCommissionsAccountRoutingModule } from './list-commissions-account-routing.module';



@NgModule({
  declarations: [ListCommissionsAccountComponent],
  imports: [

    CommonModule,
    SharedModule,
    ListCommissionsAccountRoutingModule
  ]
})
export class ListCommissionsAccountModule { }
