import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlankPageComponent } from './blank-page.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: BlankPageComponent }
  ])],
  exports: [RouterModule]
})
export class BlankPageRoutingModule { }
