import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionGuard } from 'src/app/core/guards/permissions.guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                loadChildren: () =>
                    import('./home/home.module').then((m) => m.HomeModule),
            },
            {
                path: 'news',
                loadChildren: () =>
                    import('./news/news.module').then((m) => m.NewsModule),
            },

            {
                path: 'update-user',
                loadChildren: () =>
                    import('./update-user/update-user.module').then(
                        (m) => m.UpdateUserModule
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
                path: 'newss',
                loadChildren: () =>
                    import('./newss/newss.module').then((m) => m.NewssModule),
            },
            {
                path: 'doccument',
                loadChildren: () =>
                    import('./doccument/doccument.module').then(
                        (m) => m.DoccumentModule
                    ),
            },
            {
                path: 'detail-news/:id',
                loadChildren: () =>
                    import('./detail-news/detail-news.module').then(
                        (m) => m.DetailNewsModule
                    ),
            },
            {
                path: 'cart',
                loadChildren: () =>
                    import('./cart/cart.module').then((m) => m.CartModule),
            },
            {
                path: 'order-history-user',
                loadChildren: () =>
                    import(
                        './order-history-user/order-history-user.module'
                    ).then((m) => m.OrderHistoryModule),
            },
            {
                path: 'detail-amount',
                loadChildren: () =>
                    import('./detail-amount/detail-amount.module').then(
                        (m) => m.DetailAmountModule
                    ),
            },
            {
                path: 'payment',
                loadChildren: () =>
                    import('./payment/payment.module').then(
                        (m) => m.PaymentModule
                    ),
            },
            {
                path: 'manual-payment/:id',
                loadChildren: () =>
                    import('./manual-payment/manual-payment.module').then(
                        (m) => m.ManualPaymentModule
                    ),
            },
            {
                path: 'about',
                loadChildren: () =>
                    import('./about/about.module').then((m) => m.AboutModule),
            },
            {
                path: 'products',
                loadChildren: () =>
                    import('./products/product-all/product-all.module').then(
                        (m) => m.ProductAllModule
                    ),
            },
            {
                path: 'productdetail/:id',
                loadChildren: () =>
                    import('./productdetail/productdetail.module').then(
                        (m) => m.ProductdetailModule
                    ),
            },
            {
                path: 'contact',
                loadChildren: () =>
                    import('./contact/contact.module').then(
                        (m) => m.ContactModule
                    ),
            },
            {
                path: 'user-information',
                loadChildren: () =>
                    import('./user-infomation/user-infomation.module').then(
                        (m) => m.UserInfomationModule
                    ),
            },

            {
                path: 'user-information',
                loadChildren: () =>
                    import('./user-infomation/user-infomation.module').then(
                        (m) => m.UserInfomationModule
                    ),
            },
            {
                path: 'resend-email-otp',
                loadChildren: () =>
                    import(
                        './auth/resend-email-otp/resend-email-otp.module'
                    ).then((m) => m.ResendEmailOtpModule),
            },
            {
                path: 'set-password',
                loadChildren: () =>
                    import('./auth/set-password/set-password.module').then(
                        (m) => m.SetPasswordModule
                    ),
            },
            {
                path: 'change-password',
                loadChildren: () =>
                    import(
                        './auth/change-password/change-password.module'
                    ).then((m) => m.ChangePasswordModule),
            },
            {
                path: 'newss',
                loadChildren: () =>
                    import('./newss/newss.module').then((m) => m.NewssModule),
            },
            {
                path: 'register-referal',
                loadChildren: () =>
                    import(
                        'src/app/components/client/auth/register-referal/register-referal.module'
                    ).then((m) => m.RegisterReferalModule),
            },
            {
                path: 'withdraw',
                loadChildren: () =>
                    import('./withdraw/withdraw.module').then(
                        (m) => m.WithdrawModule
                    ),
            },
            {
                path: 'withdraw-history',
                loadChildren: () =>
                    import('./withdraw-history/withdraw-history.module').then(
                        (m) => m.WithdrawHistoryModule
                    ),
            },
            {
                path: 'productsearch',
                loadChildren: () =>
                    import(
                        './products/product-showsearch/product-showsearch.module'
                    ).then((m) => m.ProductShowsearchModule),
            },
            {
                path: 'productcategory/:id',
                loadChildren: () =>
                    import('./products/products.module').then(
                        (m) => m.ProductsModule
                    ),
            },
            {
                path: 'order-history',
                loadChildren: () =>
                    import('./order-history/order-history.module').then(
                        (m) => m.OrderHistoryModule
                    ),
            },
            // {
            //     path: 'products/show-product',
            //     loadChildren: () =>
            //         import('./products/show-product/show-product.module').then(
            //             (m) => m.ShowProductModule
            //         ),
            //     // canActivate: [PermissionGuard],
            //     // data: {
            //     //     requiredPermissions: [
            //     //         'ManageProduct',
            //     //         'ManageProduct.View',
            //     //     ],
            //     // },
            // },
            // {
            //     path: 'products/create-product',
            //     loadChildren: () =>
            //         import(
            //             './products/create-product/create-product.module'
            //         ).then((m) => m.CreateProductModule),
            //     // canActivate: [PermissionGuard],
            //     // data: {
            //     //     requiredPermissions: [
            //     //         'ManageProduct',
            //     //         'ManageProduct.Create',
            //     //     ],
            //     // },
            // },
            // {
            //     path: 'products/update-product/:id',
            //     loadChildren: () =>
            //         import(
            //             './products/update-product/update-product.module'
            //         ).then((m) => m.UpdateProductModule),
            //     // canActivate: [PermissionGuard],
            //     // data: {
            //     //     requiredPermissions: [
            //     //         'ManageProduct',
            //     //         'ManageProduct.Edit',
            //     //     ],
            //     // },
            // },
            // {
            //     path: 'product-category/show',
            //     loadChildren: () =>
            //         import(
            //             './product-category/show-product-category/show-product-category.module'
            //         ).then((m) => m.ShowProductCategoryModule),
            // },
            // {
            //     path: 'brand/show-brand',
            //     loadChildren: () =>
            //         import('./brand/brand.module').then((m) => m.BrandModule),
            //     // canActivate: [PermissionGuard],
            //     // data: {
            //     //     requiredPermissions: ['ManageBrand', 'ManageBrand.View'],
            //     // },
            // },
            // {
            //     path: 'user/show-user',
            //     loadChildren: () =>
            //         import('./user/user.module').then((m) => m.UserModule),
            // },
            // {
            //     path: 'group-right/show-group-right',
            //     loadChildren: () =>
            //         import(
            //             './role/group-rights/group-rights.module'
            //         ).then((m) => m.GroupRightsModule),
            // },
            // {
            //     path: 'role',
            //     loadChildren: () =>
            //         import('./role/update-role/update-role.module').then(
            //             (m) => m.UpdateRoleModule
            //         ),
            // },
            // end tny code

            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class ClientRoutingModule {}
