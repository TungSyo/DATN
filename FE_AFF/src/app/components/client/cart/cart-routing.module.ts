import { CartComponent } from './cart.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: CartComponent }])],
    exports: [RouterModule],
})
export class CartRoutingModule {}
