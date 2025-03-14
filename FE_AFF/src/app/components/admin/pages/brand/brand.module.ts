import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { BrandComponent } from './brand.component';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  imports: [
    [
      RouterModule.forChild([
        { path: '', component: BrandComponent },
      ]),
    ],
    SharedModule,
    TreeSelectModule,
    InputSwitchModule,
    MessagesModule,
    ToastModule,
    PaginatorModule
  ],
  declarations: [BrandComponent],
})
export class BrandModule { }
