import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from 'src/app/core/https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpLoadingService) {}

    create(request: any): Observable<any> {
        return this.http.post('user/create-by-phone', request);
    }

    getPaging(request: any = null): Observable<any> {
        return this.http.get('user/paging', request);
    }

    getById(request: any = null): Observable<any> {
        return this.http.get('user/get-by-id', request);
    }

    getPagingCustomer(request: any = null): Observable<any> {
        return this.http.get('user/paging-customer', request);
    }

    updateUser(request: any = null): Observable<any> {
        return this.http.put('user/edit-user-info', request);
    }

    getPaggingRefferal(request: any = null): Observable<any> {
        return this.http.get('user/paging-referral-code', request);
    }
}
