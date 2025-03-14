import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlankPageGuard } from 'src/app/core/guards/blank-page.guard';
import { PermissionGuard } from 'src/app/core/guards/permissions.guard';
import { PermissionConstants } from 'src/app/core/models/permissions';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'banner',
                loadChildren: () =>
                    import('./banner/banner.module').then(
                        (m) => m.BannerModule
                    ),
            },
            {
                path: 'account-user',
                loadChildren: () =>
                    import('./account-user/account-user.module').then(
                        (m) => m.AccountUserModule
                    ),
            },

            {
                path: 'account-refferal',
                loadChildren: () =>
                    import('./account-refferal/account-refferal.module').then(
                        (m) => m.AccountRefferalModule
                    ),
            },
            {
                path: 'news',
                loadChildren: () =>
                    import('./news/news-list/news-list.module').then(
                        (m) => m.NewsListModule
                    ),
                canActivate: [PermissionGuard],
                data: {
                    conditions: {
                        allOf: [
                            PermissionConstants.ManageNews,
                            PermissionConstants.ManageNewsView,
                        ],
                        anyOf: [
                            PermissionConstants.Admin,
                            PermissionConstants.Master,
                        ],
                    },
                },
            },
            {
                path: 'news/create',
                loadChildren: () =>
                    import('./news/news-create/news-create.module').then(
                        (m) => m.NewsCreateModule
                    ),
                canActivate: [PermissionGuard],
                data: {
                    conditions: {
                        allOf: [
                            PermissionConstants.ManageNews,
                            PermissionConstants.ManageNewsCreate,
                        ],
                        anyOf: [
                            PermissionConstants.Admin,
                            PermissionConstants.Master,
                        ],
                    },
                },
            },
            {
                path: 'blank-page',
                loadChildren: () =>
                    import('./blank-page/blank-page.module').then(
                        (m) => m.BlankPageModule
                    ),
                canActivate: [BlankPageGuard],
            },
            {
                path: 'news/update/:id',
                loadChildren: () =>
                    import('./news/news-update/news-update.module').then(
                        (m) => m.NewsUpdateModule
                    ),
                canActivate: [PermissionGuard],
                data: {
                    conditions: {
                        allOf: [
                            PermissionConstants.ManageNews,
                            PermissionConstants.ManageNewsEdit,
                        ],
                        anyOf: [
                            PermissionConstants.Admin,
                            PermissionConstants.Master,
                        ],
                    },
                },
            },
            {
                path: 'products/show-product',
                loadChildren: () =>
                    import('./product/show-product/show-product.module').then(
                        (m) => m.ShowProductModule
                    ),
                canActivate: [PermissionGuard],
                data: {
                    conditions: {
                        allOf: [
                            PermissionConstants.ManageProduct,
                            PermissionConstants.ManageProductView,
                        ],
                        anyOf: [
                            PermissionConstants.Admin,
                            PermissionConstants.Master,
                        ],
                    },
                },
            },
            {
                path: 'products/create-product',
                loadChildren: () =>
                    import(
                        './product/create-product/create-product.module'
                    ).then((m) => m.CreateProductModule),
                canActivate: [PermissionGuard],
                data: {
                    conditions: {
                        allOf: [
                            PermissionConstants.ManageProduct,
                            PermissionConstants.ManageProductCreate,
                        ],
                        anyOf: [
                            PermissionConstants.Admin,
                            PermissionConstants.Master,
                        ],
                    },
                },
            },
            {
                path: 'products/update-product/:id',
                loadChildren: () =>
                    import(
                        './product/update-product/update-product.module'
                    ).then((m) => m.UpdateProductModule),
                canActivate: [PermissionGuard],
                data: {
                    conditions: {
                        allOf: [
                            PermissionConstants.ManageProduct,
                            PermissionConstants.ManageProductEdit,
                        ],
                        anyOf: [
                            PermissionConstants.Admin,
                            PermissionConstants.Master,
                        ],
                    },
                },
            },
            {
                path: 'product-category/show',
                loadChildren: () =>
                    import(
                        './product-category/show-product-category/show-product-category.module'
                    ).then((m) => m.ShowProductCategoryModule),
                canActivate: [PermissionGuard],
                data: {
                    conditions: {
                        allOf: [
                            PermissionConstants.ManageProductCategory,
                            PermissionConstants.ManageProductCategoryView,
                        ],
                        anyOf: [
                            PermissionConstants.Admin,
                            PermissionConstants.Master,
                        ],
                    },
                },
            },
            {
                path: 'brand/show-brand',
                loadChildren: () =>
                    import('./brand/brand.module').then((m) => m.BrandModule),
                canActivate: [PermissionGuard],
                data: {
                    conditions: {
                        allOf: [
                            PermissionConstants.ManageBrand,
                            PermissionConstants.ManageBrandView,
                        ],
                        anyOf: [
                            PermissionConstants.Admin,
                            PermissionConstants.Master,
                        ],
                    },
                },
            },
            {
                path: 'tree-binary/show',
                loadChildren: () =>
                    import('./tree-binary/tree-binary.module').then(
                        (m) => m.TreeBinaryModule
                    ),
                canActivate: [PermissionGuard],
                data: {
                    conditions: {
                        allOf: [PermissionConstants.ManageTree],
                        anyOf: [
                            PermissionConstants.Admin,
                            PermissionConstants.Master,
                        ],
                    },
                },
            },
            {
                path: 'user/show-user',
                loadChildren: () =>
                    import('./user/user.module').then((m) => m.UserModule),
                canActivate: [PermissionGuard],
                data: {
                    conditions: {
                        allOf: [
                            PermissionConstants.ManageUser,
                            PermissionConstants.ManageUserView,
                        ],
                        anyOf: [
                            PermissionConstants.Admin,
                            PermissionConstants.Master,
                        ],
                    },
                },
            },

            {
                path: 'withdraw',
                loadChildren: () =>
                    import('./withdraw/withdraw.module').then(
                        (m) => m.WithdrawModule
                    ),
            },
            {
                path: 'history-amount',
                loadChildren: () =>
                    import('./history-amount/history-amount.module').then(
                        (m) => m.HistoryAmountModule
                    ),
            },
            {
                path: 'role/show-role',
                loadChildren: () =>
                    import('./role/group-rights/group-rights.module').then(
                        (m) => m.GroupRightsModule
                    ),
                data: {
                    conditions: {
                        allOf: [
                            PermissionConstants.ManageRole,
                            PermissionConstants.ManageRoleView,
                        ],
                        anyOf: [
                            PermissionConstants.Admin,
                            PermissionConstants.Master,
                        ],
                    },
                },
            },
            {
                path: 'payments/show-payments',
                loadChildren: () =>
                    import(
                        './payments/show-payments/show-payments.module'
                    ).then((m) => m.ShowPaymentsModule),
            },
            {
                path: 'payments/create-payment',
                loadChildren: () =>
                    import(
                        './payments/create-payment/create-payment.module'
                    ).then((m) => m.CreatePaymentModule),
            },
            {
                path: 'payments/add-order',
                loadChildren: () =>
                    import('./payments/create-order/create-order.module').then(
                        (m) => m.CreateOrderModule
                    ),
            },
            {
                path: 'order/order-history',
                loadChildren: () =>
                    import('./order-history/order-history.module').then(
                        (m) => m.OrderHistoryModule
                    ),
            },
            {
                path: 'list-commissions-account',
                loadChildren: () =>
                    import('./list-commissions-account/list-commissions-account.module').then(
                        (m) => m.ListCommissionsAccountModule
                    ),
            },
            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
