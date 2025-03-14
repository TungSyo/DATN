import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { TreeBinaryComponent } from './tree-binary.component';
import { OrganizationChartModule } from 'primeng/organizationchart';

@NgModule({
  imports: [
    [
      RouterModule.forChild([
        { path: '', component: TreeBinaryComponent },
      ]),
    ],
    SharedModule,
    TreeSelectModule,
    InputSwitchModule,
    MessagesModule,
    ToastModule,
    OrganizationChartModule,
    PaginatorModule
  ],
  declarations: [TreeBinaryComponent],
})
export class TreeBinaryModule { }
