import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductAllComponent } from './product-all.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: ProductAllComponent }])],
    exports: [RouterModule],
})
export class ProductAllRoutingModule { }
