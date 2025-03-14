import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBannerComponent } from './create-banner/create-banner.component';
import { UpdateBannerComponent } from './update-banner/update-banner.component';
import { ListBannerComponent } from './list-banner/list-banner.component';

const routes: Routes = [
    {
        path: 'create',
        component: CreateBannerComponent,
    },

    {
        path: 'update/:id',
        component: UpdateBannerComponent,
    },
    {
        path: 'list',
        component: ListBannerComponent,
    },
    {
        path: '',
        component: ListBannerComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BannerRoutingModule {}
