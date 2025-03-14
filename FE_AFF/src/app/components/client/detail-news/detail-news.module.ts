import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetailNewsComponent } from './detail-news.component';

const routes: Routes = [
  { path: '', component: DetailNewsComponent }
];

@NgModule({
  imports: [
    CommonModule,  // Thêm CommonModule để sử dụng *ngIf và các directive khác
    RouterModule.forChild(routes)
  ],
  declarations: [DetailNewsComponent],
  exports: [RouterModule]
})
export class DetailNewsModule {}
