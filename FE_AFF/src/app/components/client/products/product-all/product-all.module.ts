import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductAllComponent } from './product-all.component';
import { ProductAllRoutingModule } from './product-all-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';



@NgModule({
  declarations: [ProductAllComponent],
  imports: [
    CommonModule,
    ProductAllRoutingModule,
    SharedModule
  ]
})
export class ProductAllModule { }
