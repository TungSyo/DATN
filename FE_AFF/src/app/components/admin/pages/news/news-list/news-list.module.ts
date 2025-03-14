import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { NewsCreateComponent } from '../news-create/news-create.component';
import { NewsListComponent } from './news-list.component';

@NgModule({
  imports: [
    [
      RouterModule.forChild([
        { path: '', component: NewsListComponent },
      ]),
    ],
    SharedModule,
    TreeSelectModule,
    InputSwitchModule,
    MessagesModule,
    ToastModule,
    PaginatorModule
  ],
  declarations: [NewsListComponent],
})
export class NewsListModule { }
