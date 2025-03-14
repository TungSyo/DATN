import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderHistoryRoutingModule } from './order-history-routing.module';
import { SharedModule } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { EditorModule } from 'primeng/editor';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { TreeSelectModule } from 'primeng/treeselect';
import { OrderHistoryComponent } from './order-history.component';
import {TableModule} from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
@NgModule({
    declarations: [OrderHistoryComponent],
    imports: [
        CommonModule,
        OrderHistoryRoutingModule,
        SharedModule,
        TreeSelectModule,
        InputSwitchModule,
        MessagesModule,
        ToastModule,
        PaginatorModule,
        MultiSelectModule,
        EditorModule,
        BreadcrumbModule,
        TableModule,
        CalendarModule,
    ],
})
export class OrderHistoryModule {}
