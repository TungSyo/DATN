import { CanActivateFn, Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/identity/auth.service';
import { AuthToken } from '../models/identity/auth-token.interface';
import { Page } from '../enums/page.enum';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class userInfoGuard {
    constructor(private authService: AuthService, private router: Router,private messageService: MessageService) {}

    canActivate: CanActivateFn = (route, state) => {
        const authToken: AuthToken | null =
            this.authService.getAuthTokenLocalStorage();
        if (authToken?.accessToken) {
            if (this.authService.getUserCurrent()) {
                if (this.authService.getUserCurrent().isRefreshToken == true) {
                    this.authService
                        .refreshToken({ refreshToken: authToken.refreshToken })
                        .subscribe((re) => {
                            this.authService.setAuthTokenLocalStorage(re.data);
                        });
                }
                return of(true);
            } else {
                return this.authService.fetchUserCurrent().pipe(
                    map((res) => {
                        if (res.status) {
                            if(res.data.isLockAccount==true){
                                this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Tài khoản của bạn đã bị khóa' });
                                this.authService.logout().subscribe((res) => {
                                    if (res.status == true) {
                                        this.authService.setUserCurrent(null);
                                        this.authService.setAuthTokenLocalStorage(null);
                                        localStorage.removeItem('cachedProducts');
                                        this.router.navigate([Page.Home]);
                                    }
                                    return true;
                                });                                
                            }
                            if (res.data.isRefreshToken == true) {
                                this.authService
                                    .refreshToken({
                                        refreshToken: authToken.refreshToken,
                                    })
                                    .subscribe((re) => {
                                        this.authService.setAuthTokenLocalStorage(
                                            re.data
                                        );
                                    });
                            }
                            this.authService.setUserCurrent(res.data);
                            return true;
                        } else {
                            this.authService.setUserCurrent(null);
                            this.authService.setAuthTokenLocalStorage(null);

                            // this.router.navigate([Page.Login]);
                            return true;
                        }
                    }),
                    catchError(() => {
                        this.authService.setUserCurrent(null);
                        this.authService.setAuthTokenLocalStorage(null);

                        this.router.navigate([Page.Home]);
                        return of(true);
                    })
                );
            }
        } else {
            return true;
        }
    };
}

export const userInfoGuardGuard: CanActivateFn = (route, state) => {
    return inject(userInfoGuard).canActivate(route, state);
};

// export const userInfoGuard: CanActivateFn = (route, state) => {
//   constructor(private authService: AuthService, private router: Router, private loadingService: NgxSpinnerService) {}

//   if()
//   return true;
// };
