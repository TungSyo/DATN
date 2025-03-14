import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpLoadingService } from '../https/http-loading.service';
@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  constructor(private http: HttpLoadingService) {}
  
  // Phương thức danh mục sản phẩm
  getProductCategory(request: any = null): Observable<any> {
    return this.http.get(`product-category/get-all`, request);
  }
  getProductCategoryAll(request: any = null): Observable<any> {
    return this.http.get(`product-category/get-all-tree-category`, request);
  }
}
