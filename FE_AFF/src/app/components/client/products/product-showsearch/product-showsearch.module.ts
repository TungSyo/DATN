import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductShowsearchComponent } from './product-showsearch.component';
import { ProductShowSearchRoutingModule } from './product-showsearch-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';



@NgModule({
  declarations: [ProductShowsearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProductShowSearchRoutingModule
  ]
})
export class ProductShowsearchModule { }
