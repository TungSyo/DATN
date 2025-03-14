import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewsListComponent } from './news-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: NewsListComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class NewsListRoutingModule { }
