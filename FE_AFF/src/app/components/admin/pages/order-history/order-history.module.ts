import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderHistoryRoutingModule } from './order-history-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { OrderHistoryComponent } from './order-history.component';
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
        
    ],
})
export class OrderHistoryModule {}
