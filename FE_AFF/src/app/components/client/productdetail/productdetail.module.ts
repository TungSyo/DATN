import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductDetailRoutingModule } from './productdetail-routing.module';
import { ProductdetailComponent } from './productdetail.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { SharedModule } from 'src/app/shared/modules/shared.module';




@NgModule({
  imports: [
    CommonModule,
    ProductDetailRoutingModule,
    FormsModule  ,
    SharedModule,
    NgxImageZoomModule,
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ProductdetailComponent]
})
export class ProductdetailModule { }
