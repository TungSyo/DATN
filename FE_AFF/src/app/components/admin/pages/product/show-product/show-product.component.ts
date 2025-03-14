import { Component, Injector, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MenuItem, MessageService } from 'primeng/api';
import { OptionsFilterProduct } from 'src/app/core/models/options-filter-product';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';
import { NodeService } from 'src/app/core/services/node.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { PermissionConstants } from 'src/app/core/models/permissions';
import { Router } from '@angular/router';

@Component({
    selector: 'app-show-product',
    templateUrl: './show-product.component.html',
    styleUrl: './show-product.component.scss',
    providers: [MessageService],
})
export class ShowProductComponent implements OnInit {
    imageUrl: string = environment.baseApiImageUrl;
    optionsFillerProduct: OptionsFilterProduct = new OptionsFilterProduct();
    items: MenuItem[] | undefined;
    products: any[] = [];
    treeCategory: any[] = [];
    optionsStatus: any[] = [
        { name: 'Ẩn', value: 0 },
        { name: 'Hoạt động', value: 1 },
    ];
    showAllVariants: Map<number, number> = new Map<number, number>();

    checked: boolean = false;
    listchecked: boolean[] = [];
    statusFilter: any;
    optionsCategory!: any[];
    currentPageReport: string = '';

    totalRecords = 20;
    pageSize = 30;
    pageIndex = 1;
    loading = false;

    selectedNodes: any;

    messages: any[] = [];

    showContent: boolean = false;

    showDiaLogDelete: boolean = false;
    productDelete!: any;
    DOMElementDelete: any;

    constructor(
        private productCateogryService: CategoryService,
        private productService: ProductService,
        private messageService: MessageService,
        private authService: AuthService,
        private router: Router
    ) {
        this.optionsFillerProduct.pageIndex = this.pageIndex;
        this.optionsFillerProduct.pageSize = this.pageSize;
    }

    async ngOnInit() {
        this.items = [
            { label: 'Sản phẩm', route: '/pages/products/show-product' },
            {
                label: 'Danh sách sản phẩm',
                route: '/pages/products/show-product',
            },
        ];
        this.loading = true;
        this.getAllPaging();

        // Await the filter product call
    }

    async getAllPaging() {
        let response = await this.productService.FilterProduct(
            this.optionsFillerProduct
        );

        // Subscribe to getTreeCategory to handle the response
        this.productCateogryService
            .getTreeCategory()
            .subscribe((responseGetTreeCategory) => {
                this.loading = false;
                this.treeCategory = responseGetTreeCategory.data; // Now you can access the `data` property here
            });

        // Handle products response
        this.products = response.data.items;
        this.totalRecords = response.data.totalRecords;
        this.pageIndex = 1;
        this.updateCurrentPageReport();

        // Process product variants
        for (let index = 0; index < this.products.length; index++) {
            this.showAllVariants.set(
                this.products[index].id,
                this.products[index].productVariants.length > 3 ? 1 : 0
            );
        }
    }
    toggleContent() {
        this.showContent = !this.showContent;
    }

    getFullImageUrl(imageLink: string): string {
        return `${this.imageUrl}/api/file/images/${imageLink}`;
    }

    onClear() {
        this.optionsFillerProduct.CategoryId = null;
        let label = document.querySelector(
            '.show-product-component p-treeSelect .p-treeselect-label'
        );
        if (label) {
            label.innerHTML = 'Danh mục';
        }
    }
    onNodeUnselect(event: any) {
        const unselectedNode = event.node;
        console.log(unselectedNode);
    }
    onNodeSelect() {
        this.optionsFillerProduct.CategoryId = this.selectedNodes.id;
        let label = document.querySelector(
            '.show-product-component p-treeSelect .p-treeselect-label'
        );
        if (label) {
            label.innerHTML = this.selectedNodes.name;
        }
    }

    closeDiaLogDelete() {
        this.showDiaLogDelete = false;
        this.DOMElementDelete = null;
        this.productDelete = null;
    }
    openDiaLogDelete($event: Event, product: any) {
        const userPermissions =
            this.authService.getUserCurrent()?.permissions || [];

        const hasRequiredPermissions = [
            PermissionConstants.ManageProduct,
            PermissionConstants.ManageProductDelete,
        ].every((permission) => userPermissions.includes(permission));

        const hasRequiredPermissions2 = [
            PermissionConstants.Admin,
            PermissionConstants.Master,
        ].some((permission) => userPermissions.includes(permission));

        if (hasRequiredPermissions || hasRequiredPermissions2) {
            this.showDiaLogDelete = true;
            this.DOMElementDelete = $event.target as any;
            this.productDelete = product;
        } else {
            this.messages = [
                {
                    severity: 'warn',
                    summary: 'Cảnh báo',
                    detail: 'Bạn không có quyền truy cập',
                    life: 3000,
                },
            ];
        }
    }

    async ClickDelete() {
        this.loading = true;

        // Sử dụng subscribe thay vì then
        this.productService.deleteProduct(this.productDelete.id).subscribe({
            next: () => {
                this.messages = [
                    {
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Xóa sản phẩm thành công',
                        life: 3000,
                    },
                ];
                this.loading = true;
                this.closeDiaLogDelete();
                this.getAllPaging();
            },
            error: () => {
                this.messages = [
                    {
                        severity: 'error',
                        summary: 'Thất bại',
                        detail: 'Có lỗi xảy ra',
                        life: 3000,
                    },
                ];
                this.loading = false;
                this.closeDiaLogDelete();
            },
        });
    }
    // async ClickChangeStatus($event: Event, product: any) {
    //     if ($event) {
    //         await this.productService
    //             .ChangeStatusProduct(product.id)
    //             .then(() => {
    //                 product.status = product.status === 1 ? 0 : 1;
    //                 let elementButtonStatus = $event.target as any;
    //                 elementButtonStatus.innerText =
    //                     elementButtonStatus.innerText === 'Ẩn'
    //                         ? 'Hoạt động'
    //                         : 'Ẩn';
    //                 let listProduct_Status =
    //                     elementButtonStatus.parentElement.parentElement.querySelectorAll(
    //                         '.n-product-status > div'
    //                     );
    //                 listProduct_Status.forEach(async (element: any) => {
    //                     if (element.innerText !== 'Hết hàng') {
    //                         element.style['background-color'] =
    //                             elementButtonStatus.innerText === 'Ẩn'
    //                                 ? '#50f595'
    //                                 : '#d9d9d9';
    //                         element.innerText =
    //                             elementButtonStatus.innerText === 'Ẩn'
    //                                 ? 'Hoạt động'
    //                                 : 'Ẩn';
    //                     }
    //                 });
    //             });
    //     }
    // }

    async EvenFilter() {
        this.optionsFillerProduct.Status = this.statusFilter
            ? this.statusFilter.value
            : null;
        this.optionsFillerProduct.pageIndex = 1;

        this.loading = true;
        await this.productService
            .FilterProduct(this.optionsFillerProduct)
            .then((response) => {
                this.products = response.data.items;
                this.totalRecords = response.data.totalRecords;

                if (this.optionsFillerProduct.Status === 0) {
                    let filteredProducts = response.data.items.filter(
                        (product) => {
                            return product.status === 0;
                        }
                    );
                    this.products = filteredProducts;
                    this.totalRecords = filteredProducts.length;
                }

                if (this.optionsFillerProduct.Status === 1) {
                    let filteredProducts = response.data.items.filter(
                        (product) => {
                            return product.status === 1;
                        }
                    );
                    this.products = filteredProducts;
                    this.totalRecords = filteredProducts.length;
                }

                // if (this.optionsFillerProduct.Status === 1) {
                //     let filteredProducts = response.data.items.filter(
                //         (product) => {
                //             if (product.status === 0) {
                //                 return false; // Bỏ qua sản phẩm nếu status === 0
                //             }
                //             // Nếu product.totalQuantity > 0 thì giữ lại sản phẩm
                //             if (product.totalQuantity > 0) {
                //                 // Nếu có variant nào có variant.quantity > 0, thì giữ lại các variant đó
                //                 product.productVariants =
                //                     product.productVariants.filter(
                //                         (variant) => variant.quantity > 0
                //                     );
                //                 return true; // Giữ lại sản phẩm nếu product.totalQuantity > 0
                //             }

                //             // Loại bỏ sản phẩm nếu product.totalQuantity <= 0
                //             return false;
                //         }
                //     );
                //     this.products = filteredProducts;
                //     this.totalRecords = filteredProducts.length;
                // }

                // if (this.optionsFillerProduct.Status === 2) {
                //     let filteredProducts = this.products
                //         .map((product) => {
                //             // Điều kiện product.totalQuantity = 0
                //             if (product.totalQuantity === 0) {
                //                 return product; // Giữ nguyên nếu totalQuantity = 0
                //             } else {
                //                 // Nếu totalQuantity > 0, lọc các variants với quantity = 0
                //                 const zeroQuantityVariants =
                //                     product.productVariants.filter(
                //                         (variant) => variant.quantity === 0
                //                     );

                //                 // Chỉ trả về sản phẩm nếu có variants có quantity = 0
                //                 if (zeroQuantityVariants.length > 0) {
                //                     return {
                //                         ...product,
                //                         productVariants: zeroQuantityVariants, // Chỉ giữ lại các variants có quantity = 0
                //                     };
                //                 } else {
                //                     return null; // Bỏ sản phẩm nếu không có variants nào có quantity = 0
                //                 }
                //             }
                //         })
                //         .filter((product) => product !== null); // Bỏ các sản phẩm null

                //     this.products = filteredProducts;
                //     this.totalRecords = filteredProducts.length;
                // }

                for (let index = 0; index < this.products.length; index++) {
                    this.showAllVariants.set(
                        this.products[index].id,
                        this.products[index].productVariants.length > 3 ? 1 : 0
                    );
                }
                this.updateCurrentPageReport();
            });
        this.loading = false;
    }

    // async SectionMainHead_Click_All(event: Event) {
    //     const oldheadactive = document.querySelector(
    //         '.show-product-component .section-main-head .head-active'
    //     ) as any;
    //     oldheadactive.className = '';
    //     const newheadactive = event.target as any;
    //     newheadactive.className = 'head-active';

    //     this.loading = true;
    //     let response = await this.productService.getProducts(this.pageSize, 1);
    //     this.loading = false;

    //     this.products = response.data;
    //     this.totalRecords = response.data.totalRecords;
    //     for (let index = 0; index < this.products.length; index++) {
    //         this.showAllVariants.set(
    //             this.products[index].id,
    //             this.products[index].productVariants.length > 3 ? 1 : 0
    //         );
    //     }
    // }
    async SectionMainHead_Click_Status1(event: Event) {
        const oldheadactive = document.querySelector(
            '.show-product-component .section-main-head .head-active'
        ) as any;
        oldheadactive.className = '';
        const newheadactive = event.target as any;
        newheadactive.className = 'head-active';

        this.optionsFillerProduct = new OptionsFilterProduct();
        this.optionsFillerProduct.Status = 1;
        this.optionsFillerProduct.pageSize = this.pageSize;

        this.loading = true;
        let response = await this.productService.FilterProduct(
            this.optionsFillerProduct
        );
        this.loading = false;

        this.products = response.data.items;
        this.totalRecords = response.data.totalRecords;
        for (let index = 0; index < this.products.length; index++) {
            this.showAllVariants.set(
                this.products[index].id,
                this.products[index].productVariants.length > 3 ? 1 : 0
            );
        }
    }
    async SectionMainHead_Click_Status0(event: Event) {
        const oldheadactive = document.querySelector(
            '.show-product-component .section-main-head .head-active'
        ) as any;
        oldheadactive.className = '';
        const newheadactive = event.target as any;
        newheadactive.className = 'head-active';

        this.optionsFillerProduct = new OptionsFilterProduct();
        this.optionsFillerProduct.Status = 0;
        this.optionsFillerProduct.pageSize = this.pageSize;

        this.loading = true;
        let response = await this.productService.FilterProduct(
            this.optionsFillerProduct
        );
        this.loading = false;

        this.products = response.data.items;
        this.totalRecords = response.data.totalRecords;
        for (let index = 0; index < this.products.length; index++) {
            this.showAllVariants.set(
                this.products[index].id,
                this.products[index].productVariants.length > 3 ? 1 : 0
            );
        }
    }

    async SectionMainHead_Click_Status2(event: Event) {
        const oldheadactive = document.querySelector(
            '.show-product-component .section-main-head .head-active'
        ) as any;
        oldheadactive.className = '';
        const newheadactive = event.target as any;
        newheadactive.className = 'head-active';

        this.optionsFillerProduct = new OptionsFilterProduct();
        this.optionsFillerProduct.Status = 2;
        this.optionsFillerProduct.pageSize = this.pageSize;

        this.loading = true;
        let response = await this.productService.FilterProduct(
            this.optionsFillerProduct
        );
        this.loading = false;

        this.products = response.data.items;
        this.totalRecords = response.data.totalRecords;
        for (let index = 0; index < this.products.length; index++) {
            this.showAllVariants.set(
                this.products[index].id,
                this.products[index].productVariants.length > 3 ? 1 : 0
            );
        }
    }

    async onPageChange(event: any) {
        this.optionsFillerProduct.pageSize = event.rows;
        this.pageSize = event.rows;
        this.optionsFillerProduct.pageIndex = event.page + 1;

        this.loading = true;
        let response = await this.productService.FilterProduct(
            this.optionsFillerProduct
        );
        this.loading = false;

        this.products = response.data.items;
        this.totalRecords = response.data.totalRecords;
        this.pageIndex = event.page + 1; // Cập nhật pageIndex
        this.updateCurrentPageReport(); // Gọi hàm để cập nhật thông tin trang
        for (let index = 0; index < this.products.length; index++) {
            this.showAllVariants.set(
                this.products[index].id,
                this.products[index].productVariants.length > 3 ? 1 : 0
            );
        }
    }

    get startRecord(): number {
        return (this.pageIndex - 1) * this.pageSize + 1;
    }

    get endRecord(): number {
        // Tính toán số bản ghi kết thúc (không vượt quá tổng số bản ghi)
        const calculatedEnd = (this.pageIndex - 1 + 1) * this.pageSize;
        return calculatedEnd > this.totalRecords
            ? this.totalRecords
            : calculatedEnd;
    }

    toggleShowAllVariants(index: number) {
        this.showAllVariants.set(
            index,
            this.showAllVariants.get(index) === 1 ? 2 : 1
        );
    }

    checkStartPriceValue() {
        if (this.optionsFillerProduct.StartPrice != null) {
            if (this.optionsFillerProduct.StartPrice < 1000) {
                this.optionsFillerProduct.StartPrice = null;
            }
        }
    }

    checkEndPriceValue() {
        if (this.optionsFillerProduct.EndPrice != null) {
            if (this.optionsFillerProduct.EndPrice < 1000) {
                this.optionsFillerProduct.EndPrice = null;
            }
        }
    }

    totalSellCount(arr: any) {
        return arr.reduce((accumulator: number, currentItem: any) => {
            return accumulator + currentItem.sellCounts;
        }, 0);
    }

    onKeyPress(event: KeyboardEvent) {
        const inputChar = event.key;
        if (!this.isNumberOrDecimalKey(inputChar, event.target!)) {
            event.preventDefault();
        }
    }

    isNumberOrDecimalKey(
        inputChar: string,
        inputElement: EventTarget
    ): boolean {
        const input = (inputElement as HTMLInputElement).value;

        // Allow digits and one decimal point, but prevent more than one decimal point
        if (inputChar === '.' && input.includes('.')) {
            return false;
        }

        // Allow digits and decimal point
        return /^[0-9.]$/.test(inputChar);
    }

    goToPreviousPage(): void {
        if (this.pageIndex > 1) {
            this.pageIndex--;
            this.EvenFilter();
        }
    }

    goToNextPage(): void {
        const lastPage = Math.ceil(this.totalRecords / this.pageSize);
        if (this.pageIndex < lastPage) {
            this.pageIndex++;
            this.EvenFilter();
        }
    }

    updateCurrentPageReport(): void {
        const startRecord = (this.pageIndex - 1) * this.pageSize + 1;
        const endRecord = Math.min(
            this.pageIndex * this.pageSize,
            this.totalRecords
        );
        if (this.totalRecords === 0) {
            this.currentPageReport = `<strong>0</strong> - <strong>${endRecord}</strong> trong <strong>${this.totalRecords}</strong> bản ghi`;
        }
        if (this.totalRecords > 0) {
            this.currentPageReport = `<strong>${startRecord}</strong> - <strong>${endRecord}</strong> trong <strong>${this.totalRecords}</strong> bản ghi`;
        }
    }
}
