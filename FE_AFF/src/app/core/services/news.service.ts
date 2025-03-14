import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpLoadingService } from '../https/http-loading.service';
import { ApiResult } from '../models/api-result.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  public url = environment.baseApiUrl;

  constructor(private http: HttpClient, private httpld: HttpLoadingService) { }

  getNewsPaging(request: any): Observable<any> {
    const endpoint = 'news/paging';
    return this.httpld.get(endpoint, request);
  }

  createNews(data: FormData): Observable<any> {
    return this.http.post<any>(`/news/create`, data);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`/news/get-by-id?id=${id}`);
  }

  updateNews(request: FormData): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.put(`/news/update`, request, { headers });
  }

  uploadImage(file: File, folderName: string): Observable<string> {
    const formData = new FormData();
    formData.append('DataFile', file);
    formData.append('FolderName', folderName);
  
    return this.http.post<ApiResult<string>>('/file/upload', formData).pipe(
      map((response) => {
        if (response.Status) {
          return response.Data; // URL của file đã upload
        } else {
          throw new Error(response.Message || 'Upload failed');
        }
      })
    );
  }
  

  deleteNews(request: any): Observable<any> {
    return this.http.put(`/news/delete`, request);
  }

  toggleActive(id: number): Observable<any> {
    return this.http.put(`/news/toggle-active`, { id });
  }

}
