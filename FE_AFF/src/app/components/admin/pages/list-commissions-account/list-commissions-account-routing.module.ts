import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListCommissionsAccountComponent } from './list-commissions-account.component';



@NgModule({
  exports: [RouterModule],
  imports: [
    
      RouterModule.forChild([{path:'', component: ListCommissionsAccountComponent}]),
    
    CommonModule
  ]
})
export class ListCommissionsAccountRoutingModule { }
