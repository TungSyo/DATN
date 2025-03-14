import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewsUpdateComponent } from './news-update.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: NewsUpdateComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class NewsUpdateRoutingModule { }
