import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { PaginatorModule } from 'primeng/paginator';
import { ShowProductRoutingModule } from './show-product-routing.module';
import { ShowProductComponent } from './show-product.component';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  imports: [
    SharedModule, 
    ShowProductRoutingModule,
    PaginatorModule,
    CheckboxModule
],
declarations: [ShowProductComponent],
})
export class ShowProductModule { }
