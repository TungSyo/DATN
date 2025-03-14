import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from 'src/app/core/https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class WithdrawService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('commission/paging-withdraw', request);
    }

    create(request: any): Observable<any> {
        return this.http.postFormData('commission/create-withdraw', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('indirect-commission/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('banner/delete', request);
    }

    update1(request: any): Observable<any> {
        return this.http.putFormData('indirect-commission/update-status', request);
    }
}
