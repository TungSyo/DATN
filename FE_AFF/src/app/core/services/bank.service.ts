import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from 'src/app/core/https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class BankService {
    constructor(private http: HttpLoadingService) {}

    getPaging(request: any = null): Observable<any> {
        return this.http.get('payment-account/paging', request);
    }

    create(request: FormData): Observable<any> {
        return this.http.postFormData('payment-account/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('payment-account/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('payment-account/delete', request);
    }
}
