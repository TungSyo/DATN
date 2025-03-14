import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from 'src/app/core/https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('order/paging', request);
    }

    getRevenue(request: any = null): Observable<any> {
        return this.http.get('order/get-revenue-by-month', request);
    }

    getCommission(request: any = null): Observable<any> {
        return this.http.get('commission/get-statistic-comission', request);
    }

    getUser(request: any = null): Observable<any> {
        return this.http.get('user/get-statistic-user', request);
    }

    getById(request: any = null): Observable<any> {
        return this.http.get('order/get-by-id', request);
    }

    countOrderSuccess(request: any = null): Observable<any> {
        return this.http.get('order/count-order-success', request);
    }

    createBank(request: any): Observable<any> {
        return this.http.postFormData('order/create', request);
    }
    createCommission(request: any): Observable<any> {
        return this.http.postFormData(
            'order/create-pay-with-commission-v2',
            request
        );
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('order/update-status', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('banner/delete', request);
    }
}
