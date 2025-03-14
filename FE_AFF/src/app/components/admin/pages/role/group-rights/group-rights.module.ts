import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { GroupRightsComponent } from './group-rights.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';
import { PermissionItemComponent } from '../update-role/permission-item/permission-item.component';

@NgModule({
  imports: [
    [
      RouterModule.forChild([
        { path: '', component: GroupRightsComponent },
      ]),
      PermissionItemComponent
    ],
    SharedModule,
    TreeSelectModule,
    InputSwitchModule,
    MessagesModule,
    ToastModule,
    PaginatorModule,
    MultiSelectModule,
    EditorModule
  ],
  declarations: [GroupRightsComponent],
})
export class GroupRightsModule { }
