import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'error',
                loadChildren: () =>
                    import('./error/error.module').then((m) => m.ErrorModule),
            },
            {
                path: 'access',
                loadChildren: () =>
                    import('./access/access.module').then(
                        (m) => m.AccessModule
                    ),
            },
            {
                path: 'login',
                loadChildren: () =>
                    import('./login/login.module').then((m) => m.LoginModule),
            },
            {
                path: 'set-password',
                loadChildren: () =>
                    import('./set-password/set-password.module').then((m) => m.SetPasswordModule),
            },
            {
                path: 'resend-email-otp',
                loadChildren: () =>
                    import('./resend-email-otp/resend-email-otp.module').then((m) => m.ResendEmailOtpModule),
            },
            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
