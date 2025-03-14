// src/app/shared/services/apis/product-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../https/http-loading.service';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  constructor(
    private http: HttpLoadingService,
    
  ) {}

  // Phương thức để lấy sản phẩm bán chạy
  getBestSellingProducts(request: any = null): Observable<any> {
    return this.http.get(`order/get-product-popular-v2`, request);
  }

  getNews(request: any = null): Observable<any>{
    return this.http.get('news/paging', request);
  }

  getNewsById(request: any = null): Observable<any> {
    return this.http.get(`news/get-by-id`, request);
  }

  getapiComission(request: any = null): Observable<any> {
    return this.http.get(`user/get-commission`, request);
  }
  getListBonusPoint(request:any = null): Observable<any>{
    return this.http.get(`commission/commission-history`,request);

  }
}

