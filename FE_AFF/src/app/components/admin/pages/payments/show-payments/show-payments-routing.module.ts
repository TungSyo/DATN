import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShowPaymentsComponent } from './show-payments.component';



@NgModule({
  declarations: [],
  imports: [RouterModule.forChild([{ path: '', component: ShowPaymentsComponent }])],
    exports: [RouterModule],
})
export class ShowPaymentsRoutingModule { }
