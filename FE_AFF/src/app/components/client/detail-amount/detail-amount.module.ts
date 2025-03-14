import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetailAmountComponent } from './detail-amount.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
// import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
  { path: '', component: DetailAmountComponent }
];

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    FormsModule,
    DropdownModule,
  ],
  declarations: [DetailAmountComponent],
  exports: [RouterModule]
})
export class DetailAmountModule {}
