import { ShowProductCategoryComponent } from './show-product-category.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ShowProductCategoryComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ShowProductCategoryRoutingModule {}
