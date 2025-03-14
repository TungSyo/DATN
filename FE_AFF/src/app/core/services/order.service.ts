import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from 'src/app/core/https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('order/paging', request);
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

    createPayWithCommision50Percent(request: any): Observable<any> {
        return this.http.postFormData(
            'order/create-pay-with-commission-50percent',
            request
        );
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
