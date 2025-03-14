import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { API_CONSTANTS } from '../constants/api.constants';
import { environment } from 'src/environments/environment';
import { HttpLoadingService } from '../https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    constructor(private http: HttpLoadingService) {}

    getRoleAll(PageSize: number, PageIndex: number): Observable<any> {
        const data = {
            PageSize: PageSize.toString(),
            PageIndex: PageIndex.toString(),
        };
        return this.http.get('role/paging', data);
    }

    getFiltersRoles(
        PageSize: number,
        PageIndex: number,
        Name?: string
    ): Observable<any> {
        const data: any = {
            PageSize: PageSize.toString(),
            PageIndex: PageIndex.toString(),
        };

        if (Name) {
            data.Name = Name;
        }

        return this.http.get('role/paging', data);
    }

    createRoles(userData: any): Observable<any> {
        return this.http.post('role/create', userData);
    }

    saveGroupRole(payload: any): Observable<any> {
        return this.http.put('role/edit', payload);
    }

    getGroupRoleById(Id: number): Observable<any> {
        const data = { Id: Id.toString() };
        return this.http.get('role/get-by-id', data);
    }
}
