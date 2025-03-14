import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { CartRoutingModule } from './cart-routing.module';

@NgModule({
    imports: [CommonModule, SharedModule, CartRoutingModule],
    declarations: [CartComponent],
})
export class CartModule {
   
}
