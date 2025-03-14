import { ProductsComponent } from './products.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: ProductsComponent }])],
    exports: [RouterModule],
})
export class ProductRoutingModule {}
