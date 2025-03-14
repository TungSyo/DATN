import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpLoadingService } from 'src/app/core/https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class CommistionAccount {
    constructor(private http: HttpLoadingService) {}

    getPaging(request: any = null): Observable<any> {
        return this.http.get('commission/get-user-with-commision',request)
    }

    
}
