import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { OptionsSearchProduct, Products } from '../models/product';
import { OptionsFilterProduct } from '../models/options-filter-product';
import { OptionsFilterInventoryProduct } from '../DTOs/inventory-product/optionsFilterInventoryProduct';
import { HttpLoadingService } from '../https/http-loading.service';

interface QuantityResponse {
    branchId: number;
    productId: number;
    productVariantId: number;
    quantity: number;
}

@Injectable()
export class ProductService {
    public url = environment.baseApiUrl;
    constructor(private http: HttpClient, private httpld: HttpLoadingService) { }

    private handleError(error: HttpErrorResponse): Observable<any> {
        console.error('An error occurred:', error);
        return throwError('Something bad happened; please try again later.');
    }

    getProducts(request: any): Observable<any> {
        return this.httpld.get('product/get-products-for-store', request);
    }

    getProductsOrder(request: any): Observable<any> {
        return this.httpld.get('product/filter-products', request);
    }
    getProductsById(request: any = null): Observable<any> {
        return this.httpld.get('product/get-product-and-variant', request);
    }

    checkQuantity(data: {
        branchId: number;
        productId: number;
        productVariantId: number;
    }): Observable<QuantityResponse> {
        return this.httpld.get('inventory/check-quantity', data);
    }

    getInventoryProducts(
        optionsFilterInventoryProduct: OptionsFilterInventoryProduct
    ): Observable<any> {
        const queryParams = this.buildQueryParams(
            optionsFilterInventoryProduct
        );

        return this.httpld.get('inventory/paging', queryParams);
    }

    buildQueryParams(data: any): string {
        const params = new URLSearchParams();

        Object.keys(data).forEach((key) => {
            if (data[key] !== undefined && data[key] !== null) {
                params.set(key, data[key]);
            }
        });

        return params.toString();
    }

    FilterProduct(options: OptionsFilterProduct): Promise<any> {
        const queryParams: any = {};
        if (options.KeyWord) queryParams.KeyWord = options.KeyWord;
        if (options.pageSize) queryParams.PageSize = options.pageSize;
        if (options.pageIndex) queryParams.PageIndex = options.pageIndex;
        if (options.CategoryId) queryParams.CategoryId = options.CategoryId;
        if (options.BranchId) queryParams.BranchId = options.BranchId;
        if (options.StartPrice) queryParams.StartPrice = options.StartPrice;
        if (options.EndPrice) queryParams.EndPrice = options.EndPrice;
        if (options.Status) queryParams.Status = options.Status;
        if (options.Barcode) queryParams.Barcode = options.Barcode;

        return this.httpld
            .get('product/filter-products-for-store', queryParams)
            .toPromise();
    }

    // filterProductPayment(options: OptionsFilterProduct): Promise<any> {
    //     if (options.KeyWord) queryParams.KeyWord = options.KeyWord;
    //     if (options.pageSize) queryParams.PageSize = options.pageSize;
    //     if (options.pageIndex) queryParams.PageIndex = options.pageIndex;
    //     if (options.CategoryId) queryParams.CategoryId = options.CategoryId;
    //     if (options.BranchId) queryParams.BranchId = options.BranchId;
    //     if (options.StartPrice) queryParams.StartPrice = options.StartPrice;
    //     if (options.EndPrice) queryParams.EndPrice = options.EndPrice;
    //     if (options.Status) queryParams.Status = options.Status;
    //     if (options.Barcode) queryParams.Barcode = options.Barcode;

    //     return this.httpld
    //         .get('product/filter-products-for-store', queryParams)
    //         .toPromise();
    // }

    deleteImage(id: number): Observable<void> {
        const endpoint = `product/delete-image`; // Đây là endpoint cho API xóa ảnh
        return this.httpld.delete(endpoint, { body: { id } });
    }

    private createHeaders(): HttpHeaders {
        // Tạo headers cho yêu cầu, nếu cần
        return new HttpHeaders({
            'Content-Type': 'application/json',
        });
    }

    private handleErrorResponse(error: HttpErrorResponse): void {
        console.error('Error occurred:', error.message);
        // Thêm logic xử lý lỗi tùy ý ở đây
    }

    FilterProductView(options: OptionsFilterProduct): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const queryParams = this.buildQueryParams({
                    KeyWord: options.KeyWord,
                    PageSize: options.pageSize,
                    PageIndex: options.pageIndex,
                    CategoryId: options.CategoryId,
                });

                // Call the generic get method with the correct endpoint and query parameters
                let response = await this.httpld
                    .get('product/filter-products', queryParams)
                    .toPromise();
                resolve(response);
            } catch (error) {
                reject(JSON.parse(JSON.stringify(error)));
            }
        });
    }

    FilterProductVariants(options: OptionsFilterProduct): Observable<any> {
        return this.httpld.post('productvariants/filter', options);
    }

    SearchProductVariants(options: OptionsSearchProduct): Observable<any> {
        return this.httpld.get('productvariants/filter', options);
    }

    createProduct(data: any): Observable<any> {
        return this.httpld.post('product/create-with-file', data);
    }

    deleteProduct(id: number): Observable<any> {
        const endpoint = 'product/delete';
        const body = { id }; // Dữ liệu gửi đi
    
        return this.httpld.delete(endpoint, { body }); // Gửi body qua options
    }
    
    ChangeStatusProduct(idProduct: number): Observable<any> {
        return this.httpld.get(
            `product/change-product-status/${idProduct}`,
            {}
        );
    }

    // Lấy thông tin của một sản phẩm dựa trên ID
    getProductbyId(id: number): Observable<Products> {
        // return this.httpld.get(`product/get-product-and-variant/${id}`, {});
        const endpoint = 'product/get-product-and-variant';
        const data = { Id: id };
        return this.httpld.get(endpoint, data);
    }

    updateProductAndVariant(product: any): Observable<any> {
        return this.httpld.put('product/update', product);
    }

    getCategoryAll(): Observable<any> {
        return this.httpld.get('productcategory/get-all-none-pagination', {});
    }

    CheckBarcode(
        barCode: string
    ): Observable<{ data: boolean;[key: string]: any }> {
        return this.httpld.get('product/check-bar-code', { barCode });
    }

    CheckSku(sku: string): Observable<{ data: boolean;[key: string]: any }> {
        return this.httpld.get('product/check-sku', { sku });
    }

    createStockIn(data: any): Observable<any> {
        return this.httpld.post('inventory-stock-in/create', data);
    }

    CheckBarcodeVariant(
        barCodeVr: string
    ): Observable<{ data: boolean;[key: string]: any }> {
        return this.httpld.get('productvariants/checkbarcodevariant', {
            barCodeVr,
        });
    }

    CheckBarcodeSku(
        sku: string
    ): Observable<{ data: boolean;[key: string]: any }> {
        return this.httpld.get('productvariants/checksku', { sku });
    }

    checkBarcodeUpdate(barcode: string, productId: number): Observable<any> {
        return this.httpld.get('product/checkbarcode', {
            barCode: barcode,
            id: productId,
        });
    }

    checkSkuUpdate(sku: string, productId: number): Observable<any> {
        return this.httpld.get('product/check-sku', { sku, id: productId });
    }

    getShipmentProductByCode(productCode: string): Observable<any> {
        return this.httpld.get('shipments/getshipmentproduct', {
            productCode: encodeURIComponent(productCode),
        });
    }

    // getStockDetailsByProductCode(productCode: string): Observable<any> {
    //     return this.httpld.get('inventory-stock-in/getstockindetailsbyproductcode', { productCode: encodeURIComponent(productCode) });
    // }

    getInventoryBranch(
        optionsFilterInventoryProduct: OptionsFilterInventoryProduct
    ): Observable<any> {
        return this.httpld.get(
            'inventory/paging-branch',
            optionsFilterInventoryProduct
        );
    }

    getInventoryCompany(
        optionsFilterInventoryProduct: OptionsFilterInventoryProduct
    ): Observable<any> {
        return this.httpld.get(
            'inventory/paging-total-all',
            optionsFilterInventoryProduct
        );
    }
    getProductsT(request: any = null): Observable<any> {
        return this.httpld.get('product/filter-products-for-store', request);
    }
}
