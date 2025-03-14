import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateProductComponent } from './create-product.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: CreateProductComponent }]),
    ],
    exports: [RouterModule],
})
export class CreateProductRoutingModule {}
