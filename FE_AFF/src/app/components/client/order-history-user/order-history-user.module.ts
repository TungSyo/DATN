import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderHistoryUserComponent } from './order-history-user.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component:  OrderHistoryUserComponent}
];

@NgModule({
  imports: [
    FormsModule,
    CommonModule,  // Thêm CommonModule để sử dụng *ngIf và các directive khác
    RouterModule.forChild(routes)
    
  ],
  declarations: [OrderHistoryUserComponent],
  exports: [RouterModule]
})
export class OrderHistoryModule {}
