import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpdateProductComponent } from './update-product.component';


@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: UpdateProductComponent }]),
  ],
  exports: [RouterModule],
})
export class UpdateProductRoutingModule { }
