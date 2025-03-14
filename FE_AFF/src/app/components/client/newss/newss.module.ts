import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewssRoutingModule } from './newss-routing.module';
import { NewssComponent } from './newss.component';



@NgModule({
  declarations: [NewssComponent],
  imports: [
    CommonModule,
    NewssRoutingModule
  ]
})
export class NewssModule { }
