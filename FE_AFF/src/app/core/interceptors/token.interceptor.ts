import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor as HttpSystemInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, finalize, filter, take } from 'rxjs/operators';

import { LocalStorage } from '../enums/local-storage.enum';
import { Header } from '../enums/request.enum';
import { Router } from '@angular/router';
import { Page } from '../enums/page.enum';
import { AuthToken } from '../models/identity/auth-token.interface';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../services/local-storage.service';
import { LoadingUiService } from '../loading-ui.service';
import { AuthService } from '../services/identity/auth.service';
import { HttpStatus } from '../enums/http-status.enum';
import { RefreshTokenRequest } from '../models/identity/refresh-token-request.interface';

@Injectable()
export class HttpInterceptor implements HttpSystemInterceptor {
    private apiUrl: string = environment.baseApiUrl;
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> =
        new BehaviorSubject<any>(null);

    constructor(
        private localStorageService: LocalStorageService,
        private loadingService: LoadingUiService,
        private authService: AuthService,
        private router: Router
    ) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!request.headers.has(Header.SkipLoading)) {
            // this.loadingService.show();
        } else {
            request = request.clone({
                headers: request.headers.delete(Header.SkipLoading),
            });
        }

        const authToken = this.localStorageService.getItem(
            LocalStorage.AuthToken
        ) as AuthToken;

        request = request.clone({
            url: `${this.apiUrl}${request.url}`,
            withCredentials: true,
        });

        if (authToken?.accessToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${authToken.accessToken}`,
                },
            });
        }

        return next.handle(request).pipe(
            catchError((error: any) => {
                if (
                    error instanceof HttpErrorResponse &&
                    error.status === HttpStatus.Unauthorized
                ) {
                    return this.handleUnauthorizedError(request, next);
                }

                return throwError(error);
            }),
            finalize(() => {
                // this.loadingService.hide();
            })
        );
    }

    private handleUnauthorizedError(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const authToken: AuthToken = this.localStorageService.getItem(
                LocalStorage.AuthToken
            );
            const refreshToken = authToken.refreshToken;
            if (!refreshToken) {
                return throwError('Không tồn tại RefreshToken hợp lệ!');
            }

            const refreshTokenRequest = {
                refreshToken: refreshToken,
            } as RefreshTokenRequest;

            return this.authService.refreshToken(refreshTokenRequest).pipe(
                switchMap((res: any) => {
                    this.localStorageService.setItem(
                        LocalStorage.AuthToken,
                        res.data
                    );

                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(res.data.accessToken);

                    request = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${res.data.accessToken}`,
                        },
                    });
                    return next.handle(request);
                }),
                catchError((error: any) => {
                    this.isRefreshing = false;

                    this.authService.setUserCurrent(null);
                    this.authService.setAuthTokenLocalStorage(null);

                    this.router.navigate([Page.Login]);
                    return throwError(
                        'AccessToken hoặc RefreshToken không hợp lệ!'
                    );
                })
            );
        }

        return this.refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                return next.handle(request);
            })
        );
    }
}

// import { Injectable } from '@angular/core';
// import {
//     HttpInterceptor,
//     HttpRequest,
//     HttpHandler,
//     HttpEvent,
//     HttpErrorResponse,
// } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { AuthService } from '../services/auth.service';
// import { ToastService } from '../services/toast.service';

// @Injectable()
// export class AuthenticationMiddlewareService implements HttpInterceptor {
//     constructor(
//         private authService: AuthService,
//         private toastService: ToastService
//     ) {}

//     intercept(
//         req: HttpRequest<any>,
//         next: HttpHandler
//     ): Observable<HttpEvent<any>> {
//         // Lấy token từ AuthService
//         const authToken = this.authService.getAuthTokenLocalStorage();
//         if (authToken?.accessToken != null) {
//             req = req.clone({
//                 setHeaders: {
//                     Authorization: `Bearer ${authToken.accessToken}`,
//                 },
//             });
//         }

//         // Xử lý request và bắt lỗi
//         return next.handle(req).pipe(
//             catchError((error: HttpErrorResponse) => {
//                 if (error.status === 403) {
//                     this.toastService.showError(
//                         'Chú ý',
//                         'Bạn không có quyền truy cập!'
//                     );
//                 }
//                 return throwError(error); // Bảo tồn lỗi gốc
//             })
//         );
//     }
// }
