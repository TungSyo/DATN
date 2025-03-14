import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpLoadingService } from '../https/http-loading.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  public url = environment.baseApiUrl;
  constructor(private http: HttpLoadingService) { }

  // getPermissionAll(PageSize: number, PageIndex: number): Observable<any> {
  //   let params = new HttpParams()
  //     .set('PageSize', PageSize.toString())
  //     .set('PageIndex', PageIndex.toString());
  //   return this.http.get<any>(
  //     `${this.url}/api/permission/paging`, { params: params });
  // }

  getPermissionAll(request: any = null): Observable<any> {
    return this.http.get('permission/paging', request);
}


}
