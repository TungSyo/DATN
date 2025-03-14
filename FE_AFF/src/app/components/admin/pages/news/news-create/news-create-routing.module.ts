import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewsCreateComponent } from './news-create.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: NewsCreateComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class NewsCreateRoutingModule { }
