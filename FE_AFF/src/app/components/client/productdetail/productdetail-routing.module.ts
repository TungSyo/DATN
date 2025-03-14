import { ProductdetailComponent } from './productdetail.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: ProductdetailComponent }])],
    exports: [RouterModule],
})
export class ProductDetailRoutingModule {}
