// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class VoucherService {

// constructor() { }

// }
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from 'src/app/core/https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class VoucherService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('voucher/paging', request);
    }

    create(request: any): Observable<any> {
        return this.http.postFormData('voucher/create', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('voucher/delete', request);
    }

    deleteHard(request: any): Observable<any> {
        return this.http.deleteHard('voucher/delete', request);
    }

    // delete(request: any): Observable<any> {
    //     return this.http.put('banner/delete', request);
    // }

    applyVoucher(request: any): Observable<any> {
        return this.http.postQuery('order/apply-voucher-condition', request);
    }
}
