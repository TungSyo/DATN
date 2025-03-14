import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { CreateOrderRoutingModule } from './create-order-routing.module';
import { CreateOrderComponent } from './create-order.component';
import { EditorModule } from 'primeng/editor';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';



@NgModule({
    imports: [
        [
            RouterModule.forChild([
                { path: '', component: CreateOrderComponent },
            ]),
        ],
        CommonModule,
        CreateOrderRoutingModule,
        EditorModule,
        SharedModule,
        TreeSelectModule,
        InputSwitchModule,
        MessagesModule,
        ToastModule,
        PaginatorModule,
        MultiSelectModule,
        EditorModule,

    ],
    declarations: [CreateOrderComponent],
})
export class CreateOrderModule {}
