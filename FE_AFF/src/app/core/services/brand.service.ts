import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Brand } from '../models/brands';
import { HttpLoadingService } from '../https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class BrandService {
    public url = environment.baseApiUrl;

    constructor(private http: HttpClient, private httpld: HttpLoadingService) { }

    getBrands(pageSize: number, pageIndex: number, name?: string): Observable<any> {
        const endpoint = 'brand/get-all';
        const data: any = { pageSize, pageIndex };
    
        if (name) {
            data.name = name;
        }
    
        return this.httpld.get(endpoint, data);
    }

    createBrand(data: any): Observable<any> {
        return this.httpld.post('brand/create', data);
    }

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }

    CheckBrandExistence(name: string): Observable<boolean> {
        const data = { name }; // Prepare the data to send with the request
        return this.httpld.get('brand/check-exist', data);
    }

    // BrandService

    checkBrandExist(name: string): Observable<{ status: boolean; message: string; data: boolean }> {
        const endpoint = 'brand/check-exist';
        const data = { name: name }; // Passing the name as a query parameter
        return this.httpld.get(endpoint, data);
    }


    getBrandById(id: number): Observable<any> {
        const endpoint = 'brand/get-by-id';
        const data = { Id: id };
        return this.httpld.get(endpoint, data);
    }
    updateBrand(brandData: any): Observable<any> {
        const endpoint = 'brand/update';
        return this.httpld.put(endpoint, brandData);
    }
    checkBrandExistenceUpdate(name: string, id: number): Observable<{ status: boolean; message: string; data: boolean }> {
        const endpoint = 'brand/check-exist-update';
        const data = { name, id };
        return this.httpld.get(endpoint, data);
    }
    updateStatus(id: number, isDeleted: number): Observable<any> {
        const url = `brand/UpdateStatus/${id}/${isDeleted}`;
        const data = {}; // Dữ liệu cần gửi đi, nếu có thể truyền rỗng.
        return this.httpld.put(url, data);
    }
    getAllBrands(): Observable<any> {
        const endpoint = 'brand/get-all';
        const data = {};
        return this.httpld.get(endpoint, data);
    }

    searchBrands(
        pageSize: number,
        pageIndex: number,
        keySearch: string
    ): Observable<any> {
        const data = {
            pageSize: pageSize.toString(),
            pageIndex: pageIndex.toString(),
            keySearch: keySearch,
        };
        return this.httpld.get('brand/search', data);
    }
}
