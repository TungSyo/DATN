import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowPaymentsComponent } from './show-payments.component';
import { ShowPaymentsRoutingModule } from './show-payments-routing.module';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { DialogModule } from 'primeng/dialog';



@NgModule({
  declarations: [ShowPaymentsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ShowPaymentsRoutingModule,
    TableModule,
    ButtonModule,
    PaginatorModule,
    CheckboxModule,
    SharedModule,
    DialogModule
    
  ]
})
export class ShowPaymentsModule {}
