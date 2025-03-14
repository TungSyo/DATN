import {
    HttpClient,
    HttpErrorResponse,
    HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TreeNode } from 'primeng/api';
import { map } from 'rxjs/operators';
import { HttpLoadingService } from '../https/http-loading.service';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    constructor(private httpld: HttpLoadingService) {}
    getTreeCategory(): Observable<any> {
        const endpoint = 'product-category/get-all-tree-category';
        const data = {};
        return this.httpld.get(endpoint, data);
    }
    getCategorys(PageSize: number, PageIndex: number, name: string): Observable<any> {
        const endpoint = 'product-category/get-all';
        const data = { PageSize, PageIndex, Name: name, };
        return this.httpld.get(endpoint, data);
    }
    getCategoryAll(): Observable<any> {
        const endpoint = 'product-category/get-all-none-paging';
        const data = {}; // Pass any necessary data if required for the API call, otherwise, leave it as an empty object.
        return this.httpld.get(endpoint, data);
    }
    createCategory(data: any): Observable<any> {
        return this.httpld.post('product-category/create', data);
    }

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }

    CheckCategoryExistence(name: string): Observable<any> {
        const params = { name };
        return this.httpld.get('product-category/get-by-name', params).pipe(
            catchError((error) => {
                // Handle error here if needed
                return throwError(error);
            })
        );
    }

    getCategoryById(id: number): Observable<any> {
        const endpoint = 'product-category/get-by-id';
        const data = { Id: id };
        return this.httpld.get(endpoint, data);
    }

    updateCategory(categoryData: any): Observable<any> {
        const endpoint = 'product-category/update';
        return this.httpld.put(endpoint, categoryData);
    }

    checkCategoryExistenceUpdate(
        name: string,
        id: number
    ): Observable<boolean> {
        const endpoint = 'product-category/CheckExistenceUpdate';
        const data = { name, id };

        return this.httpld.get(endpoint, data) as Observable<boolean>;
    }

    updateStatus(id: number, isDeleted: number): Observable<any> {
        const endpoint = `product-category/UpdateStatus/${id}/${isDeleted}`;
        return this.httpld.put(endpoint, {});
    }

    searchCategories(term: string): Observable<any[]> {
        const data = { name_or_id: term };
        return this.httpld.get('product-category/filter-with-name-or-id', data);
    }

    searchBrands(
        pageSize: number,
        pageNumber: number,
        keySearch: string
    ): Observable<any> {
        const endpoint = 'brand/search';
        const data = {
            pageSize: pageSize.toString(),
            pageNumber: pageNumber.toString(),
            keySearch: keySearch,
        };
        return this.httpld.get(endpoint, data);
    }

    getSubcategories(parentId?: number): Observable<any> {
        const endpoint = `product-category/get-all-immediate-child/${parentId}`;
        return this.httpld.get(endpoint, {});
    }

    getCategoriesAndChild(): Observable<TreeNode[]> {
        const endpoint = 'product-category/get-all-tree-category';
        return this.httpld
            .get(endpoint, {})
            .pipe(map((response: any) => this.mapToTreeNodes(response.data)));
    }

    // Phương thức để chuyển đổi dữ liệu API thành định dạng TreeNode[]
    // private mapToTreeNodes(data: any[]): TreeNode[] {
    //     return data.map((category) => ({
    //         label: category.name,
    //         data: category,
    //         leaf: !category.children || category.children.length === 0,
    //         children: this.mapToTreeNodes(category.children),
    //     }));
    // }

    private mapToTreeNodes(data: any[]): TreeNode[] {
        return data
            .filter((category) => category.status === 1) // Only include categories with status = 1
            .map((category) => ({
                label: category.name,
                data: category,
                leaf: !category.children || category.children.length === 0,
                children: category.children
                    ? this.mapToTreeNodes(category.children)
                    : [],
            }));
    }
}
