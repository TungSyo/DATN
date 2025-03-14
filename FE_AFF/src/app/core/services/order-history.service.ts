import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from 'src/app/core/https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class OrderHistoryService {
    constructor(private http: HttpLoadingService) {}

    getPaging(request: any = null): Observable<any> {
        return this.http.get('order/paging', request);
    }

    getIDorder(request: any = null): Observable<any> {
        return this.http.get('order/get-by-id', request);
    }
    getPagingvAdmin(request: any = null): Observable<any> {
        return this.http.get('order-history/paging', request);
    }
}
