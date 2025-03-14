import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrandComponent } from './brand.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: BrandComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class BrandRoutingModule { }
