import { Inject } from "@angular/core";
import { HttpLoadingService } from '../https/http-loading.service';
import { Observable } from "rxjs";

@Inject({
   providedIn: 'root',
})

export class BonusPoints {
    constructor(
        private http : HttpLoadingService
    ){}


    getListBonusPoint(request:any = null): Observable<any>{
        return this.http.get(`commission/commission-history`,request);

    }
}