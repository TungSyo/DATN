import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DoccumentComponent } from './doccument.component';

const routes: Routes = [
  { path: '', component: DoccumentComponent }
];

@NgModule({
  imports: [
    CommonModule,  // Thêm CommonModule để sử dụng *ngIf và các directive khác
    RouterModule.forChild(routes)
  ],
  declarations: [DoccumentComponent],
  exports: [RouterModule]
})
export class DoccumentModule {}
