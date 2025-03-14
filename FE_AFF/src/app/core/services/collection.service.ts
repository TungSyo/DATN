// import {
//     HttpClient,
//     HttpErrorResponse,
//     HttpParams,
// } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, catchError, throwError } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { Collection } from '../models/collections';

// @Injectable({
//     providedIn: 'root',
// })
// export class CollectionService {
//     public url = environment.url;

//     constructor(private http: HttpClient) {}

//     getAllCols(): Observable<any[]> {
//         return this.http.get<any[]>(
//             `${this.url}/api/collections/getallcollections`
//         );
//     }

//     getCollections(pageSize: number, pageNumber: number): Observable<any> {
//         return this.http.get<any>(
//             `${this.url}/api/collections/get-all?pageSize=${pageSize}&pageNumber=${pageNumber}`
//         );
//     }
//     createCollection(data: any): Observable<any> {
//         return this.http
//             .post<any>(`${this.url}/api/collections/create`, data)
//             .pipe(catchError(this.handleError));
//     }

//     private handleError(error: HttpErrorResponse): Observable<any> {
//         console.error('An error occurred:', error);
//         return throwError('Something bad happened; please try again later.');
//     }

//     CheckExistence(name: string): Observable<boolean> {
//         return this.http.get<boolean>(
//             `${this.url}/api/collections/CheckExistence?name=${name}`
//         );
//     }
//     getCollectionById(id: number): Observable<any> {
//         const url = `${this.url}/api/collections/get-one/${id}`;
//         return this.http.get<any>(url);
//     }
//     updateCollection(brandData: any): Observable<any> {
//         const url = `${this.url}/api/collections/update`; // Endpoint API cho việc cập nhật thương hiệu
//         return this.http.put<any>(url, brandData);
//     }
//     checkExistenceUpdate(name: string, id: number): Observable<boolean> {
//         return this.http.get<boolean>(
//             `${this.url}/api/collections/CheckExistenceUpdate?name=${name}&id=${id}`
//         );
//     }
//     updateStatus(id: number, isDeleted: number): Observable<any> {
//         const url = `${this.url}/api/collections/UpdateStatus/${id}/${isDeleted}`;
//         return this.http.put<any>(url, {});
//     }
//     getAllCollections(): Observable<Collection[]> {
//         return this.http.get<Collection[]>(
//             `${this.url}/api/collections/getallbrandpro`
//         );
//     }
//     searchCollections(
//         pageSize: number,
//         pageNumber: number,
//         keySearch: string
//     ): Observable<any> {
//         return this.http.get<any>(`${this.url}/api/collections/search`, {
//             params: {
//                 pageSize: pageSize.toString(),
//                 pageNumber: pageNumber.toString(),
//                 keySearch: keySearch,
//             },
//         });
//     }
// }
