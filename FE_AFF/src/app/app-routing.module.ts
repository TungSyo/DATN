import { HomeModule } from './components/client/home/home.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from 'src/app/components/admin/shared/notfound/notfound.component';
import { AppLayoutComponent } from './layout/admin-layout/app.layout.component';
import { userInfoGuardGuard } from './core/guards/user-info.guard';
import { aU } from '@fullcalendar/core/internal-common';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { ClientLayoutComponent } from './layout/client-layout/client-layout.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: 'admin',
                    component: AppLayoutComponent,
                    canActivate: [userInfoGuardGuard],
                    children: [
                        {
                            path: 'dashboard',
                            canActivate: [AdminGuard],
                            loadChildren: () =>
                                import(
                                    'src/app/components/admin/shared/dashboard/dashboard.module'
                                ).then((m) => m.DashboardModule),
                        },

                        // {
                        //     path: 'blank-page',
                        //     loadChildren: () =>
                        //         import(
                        //             './components/admin/shared/blank-page/blank-page.module'
                        //         ).then((m) => m.BlankPageModule),
                        // },
                        {
                            path: 'pages',
                            canActivate: [AdminGuard],
                            loadChildren: () =>
                                import(
                                    './components/admin/pages/pages.module'
                                ).then((m) => m.PagesModule),
                        },
                        {
                            path: '',
                            canActivate: [AdminGuard],
                            loadChildren: () =>
                                import(
                                    'src/app/components/admin/shared/dashboard/dashboard.module'
                                ).then((m) => m.DashboardModule), // canActivate: [AdminGuard],
                        },
                    ],
                },

                {
                    path: 'admin/auth/login',
                    loadChildren: () =>
                        import(
                            'src/app/components/admin/auth/login/login.module'
                        ).then((m) => m.LoginModule),
                },

                {
                    path: '',
                    component: ClientLayoutComponent,
                    canActivate: [userInfoGuardGuard],
                    children: [
                        {
                            path: '',
                            loadChildren: () =>
                                import(
                                    'src/app/components/client/client.module'
                                ).then((m) => m.ClientModule),
                        },
                    ],
                },

                { path: 'notfound', component: NotfoundComponent },
                { path: '**', redirectTo: '/notfound', pathMatch: 'full' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
