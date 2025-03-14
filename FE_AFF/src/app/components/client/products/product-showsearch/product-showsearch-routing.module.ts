import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductShowsearchComponent } from './product-showsearch.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: ProductShowsearchComponent }])],
    exports: [RouterModule],
})
export class ProductShowSearchRoutingModule {}
