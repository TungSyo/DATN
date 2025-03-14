import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OptionsFilterBranch } from '../DTOs/branch/optionsFilterBranchs';
import { OptionsFilterDistrict } from '../DTOs/address/optionsFilterDistrict';
import { OptionsFilterWard } from '../DTOs/address/optionsFilterWard';
import { HttpLoadingService } from '../https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class AddressService {
    constructor(private http: HttpLoadingService) {}

    getDistricts(request: any): Observable<any> {
        const endpoint = 'address/get-districts';
        return this.http.get(endpoint, request);
    }

    getWards(request: any): Observable<any> {
        const endpoint = 'address/get-wards';
        return this.http.get(endpoint, request);
    }

    getCitiesByIdCountry(request: any): Observable<any> {
        const endpoint = 'address/get-cities';
        return this.http.get(endpoint, request);
    }

    getCityById(request: any): Observable<any> {
        const endpoint = 'address/get-city-id';
        return this.http.get(endpoint, request);
    }

    getDistrictById(request: any): Observable<any> {
        const endpoint = 'address/get-district-id';
        return this.http.get(endpoint, request);
    }

    getWardById(request: any): Observable<any> {
        const endpoint = 'address/get-ward-id';
        return this.http.get(endpoint, request);
    }

    getDistrictsByIdCity(request: any): Observable<any> {
        const endpoint = 'address/get-districts';
        return this.http.get(endpoint, request);
    }

    getWardsByIdDistrict(request: any): Observable<any> {
        const endpoint = 'address/get-wards';
        return this.http.get(endpoint, request);
    }
}
