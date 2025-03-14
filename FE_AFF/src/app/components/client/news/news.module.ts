import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NewsComponent } from './news.component';

const routes: Routes = [
  { path: '', component: NewsComponent }
];

@NgModule({
  imports: [
    CommonModule,  // Thêm CommonModule để sử dụng *ngIf và các directive khác
    RouterModule.forChild(routes)
  ],
  declarations: [NewsComponent],
  exports: [RouterModule]
})
export class NewsModule {}
