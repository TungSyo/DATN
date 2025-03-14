import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShowProductComponent } from './show-product.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: ShowProductComponent }])
  ],
  exports: [RouterModule],
})
export class ShowProductRoutingModule { }
