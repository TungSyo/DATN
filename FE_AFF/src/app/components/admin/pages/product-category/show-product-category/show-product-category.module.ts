import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShowProductCategoryComponent } from './show-product-category.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    imports: [
        [
            RouterModule.forChild([
                { path: '', component: ShowProductCategoryComponent },
            ]),
        ],
        SharedModule,
        TreeSelectModule,
        InputSwitchModule,
        MessagesModule,
        ToastModule,
        PaginatorModule
    ],
    declarations: [ShowProductCategoryComponent],
})
export class ShowProductCategoryModule {}
