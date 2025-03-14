import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from 'src/app/core/https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class BannerService {
    constructor(private http: HttpLoadingService) {}
    getPaging(request: any = null): Observable<any> {
        return this.http.get('banner/paging', request);
    }

    create(request: FormData): Observable<any> {
        return this.http.postFormData('banner/create', request);
    }

    update(request: any): Observable<any> {
        return this.http.putFormData('banner/update', request);
    }

    delete(request: any): Observable<any> {
        return this.http.put('banner/delete', request);
    }
}
