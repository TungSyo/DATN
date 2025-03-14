import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpLoadingService } from '../https/http-loading.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class OrganizationService {
    constructor(private httpld: HttpLoadingService, private http: HttpClient) { }
    getTreeData(userId: number, downLevel: number): Observable<any> {
        const endpoint = 'tree/get-position-tree';
        const data = { UserId: userId, DownLevel: downLevel };
        return this.httpld.get(endpoint, data);
    }
    getDropdownData(request: any): Observable<any> {
        const endpoint = 'user/paging';
        return this.httpld.get(endpoint, request);
    }

    addUserToTree(request: any): Observable<any> {
        const endpoint = 'tree/add-user-to-tree-use-branch-path';
        return this.httpld.post(endpoint, request);
    }
    deleteNode(userId: number): Observable<any> {
        const endpoint = 'tree/delete-node-leaf';
        return this.httpld.delete(endpoint, { body: { id: userId } });
    }

}
