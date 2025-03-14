import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { UserComponent } from './user.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';

@NgModule({
    imports: [
        [RouterModule.forChild([{ path: '', component: UserComponent }])],
        SharedModule,
        TreeSelectModule,
        InputSwitchModule,
        MessagesModule,
        ToastModule,
        PaginatorModule,
        MultiSelectModule,
        EditorModule,
    ],
    declarations: [UserComponent],
})
export class UserModule {}
