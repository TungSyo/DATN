import { HttpLoadingService } from 'src/app/core/https/http-loading.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../local-storage.service';
import { AuthToken } from '../../models/identity/auth-token.interface';
import { ApiResult } from '../../models/identity/api-result.interface';
import { UserCurrent } from '../../models/identity/user-current.interface';
import { LocalStorage } from '../../enums/local-storage.enum';
import { RefreshTokenRequest } from '../../models/identity/refresh-token-request.interface';
import { HttpService } from '../http.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService,
        private httpLoadingService: HttpLoadingService,
        private httpService: HttpService
    ) {}

    public url = environment.baseApiUrl;
    isLoggedIn(): boolean {
        const token = localStorage.getItem('token');
        if (token) {
            return true;
        }
        return false;
    }

    // tny add
    login(request: any): Observable<any> {
        return this.httpLoadingService
            .post(`auth/login-by-email`, request)
            .pipe(catchError(this.handleError));
    }

    private isInitAuthSubject: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    isInitAuth$: Observable<boolean> = this.isInitAuthSubject.asObservable();
    private currentUserSubject = new BehaviorSubject<any>(null);
    public userCurrent = this.currentUserSubject.asObservable();

    getUserCurrent() {
        return this.currentUserSubject.value;
    }

    setUserCurrent(user: any) {
        this.currentUserSubject.next(user);
    }

    //Auth token
    getAuthTokenLocalStorage(): AuthToken | null {
        const authToken: AuthToken | null = this.localStorageService.getItem(
            LocalStorage.AuthToken
        );
        return authToken;
    }

    setAuthTokenLocalStorage(authToken: AuthToken | null) {
        // setTimeout(() => {s
        // this.localStorageService.setItem(LocalStorage.AuthToken, authToken);
        // }, 300);
        this.localStorageService.setItem(LocalStorage.AuthToken, authToken);
    }

    getUserCurrentApi(): Observable<ApiResult<UserCurrent>> {
        return this.http.get<ApiResult<UserCurrent>>(
            `${this.url}'/api/user/user-info'`
        );
    }

    fetchUserCurrent(): Observable<ApiResult<UserCurrent>> {
        let headers = this.httpService.addSkipLoadingHeader();
        return this.http.get<ApiResult<UserCurrent>>(`/user/user-info`, {
            headers,
        });
    }

    refreshToken(
        request: RefreshTokenRequest
    ): Observable<ApiResult<AuthToken>> {
        return this.http.post<ApiResult<AuthToken>>(
            `/auth/refresh-token`,
            request
        );
    }

    hasRole(role: string): boolean {
        if (!this.currentUserSubject.value) {
            return false;
        }

        if (this.currentUserSubject.value.roleNames.includes(role)) {
            return true;
        } else {
            return false;
        }
    }

    hasRoleAsync(user: any, role: string): boolean {
        if (!user) {
            return false;
        }

        if (user.roleNames.includes(role)) {
            return true;
        } else {
            return false;
        }
    }

    logout(): Observable<ApiResult<boolean>> {
        return this.http.post<ApiResult<boolean>>(`/auth/logout`, null);
    }

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }

    resendEmailOtp(request: any = null): Observable<any> {
        return this.httpLoadingService.post('auth/send-email-otp', request);
    }

    setPassword(request: any): Observable<any> {
        return this.httpLoadingService.post('user/set-password', request);
    }

    getUsers(request: any): Observable<any> {
        // return this.http.get<any>(
        //     `${this.url}/api/user/paging-info?pageSize=${pageSize}`
        // );
        return this.httpLoadingService.get('user/paging-info', request);
    }

    registerUser(request: any): Observable<any> {
        return this.httpLoadingService.post(
            `auth/register-verify-by-email`,
            request
        );
    }

    registerCustomer(request: any): Observable<any> {
        return this.httpLoadingService.post(`user/create-customer`, request);
    }

    verifyOtp(request: any): Observable<any> {
        return this.httpLoadingService.post(
            `auth/confirm-email-otp-register`,
            request
        );
    }
    // tny end add
}
