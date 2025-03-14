import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/DTOs/products/product';
import { environment } from 'src/environments/environment';
import { SortByConstant } from 'src/app/core/constants/sort-by.constant';
import { OrderByConstant } from 'src/app/core/constants/order-by.constant';
import { ProductCategory } from 'src/app/core/DTOs/productcategory/productCategory';
import { ProductCategoryService } from 'src/app/core/services/product-category.service';
import { CartService } from 'src/app/core/services/cart.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css'],
    providers: [MessageService],
})
export class ProductsComponent implements OnInit {
    cart: any[] = [];
    product: Product[] = [];
    categories: ProductCategory[] = [];
    imageUrl: string = environment.baseApiImageUrl;
    totalproduct: number;
    totalPage: number;
    currentPage: number = 1;
    pageSize: number = 15;

    // Biến để lưu lựa chọn sắp xếp
    selectedOption: string = 'Sắp xếp theo';
    isDropdownOpen: boolean = false;
    sortBy: string;
    orderBy: string;
    selectedCategoryName: string = 'Tất cả sản phẩm';
    selectedCategoryId: number = null;

    constructor(
        private productService: ProductService,
        private productCategory: ProductCategoryService,
        private route: ActivatedRoute,
        private cartService: CartService,
        private messageService: MessageService
    ) {
        this.loadCartFromLocalStorage();
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    selectOption(option: string) {
        this.selectedOption = option;
        this.isDropdownOpen = false;
        // Cập nhật SortBy và OrderBy khi người dùng chọn tùy chọn sắp xếp
        switch (option) {
            case 'Mới nhất':
                this.sortBy = null;
                this.orderBy = OrderByConstant.CreatedAt;
                break;
            case 'Giá: Thấp đến Cao':
                this.sortBy = SortByConstant.Asc;
                this.orderBy = OrderByConstant.SellingPrice;
                break;
            case 'Giá: Cao đến Thấp':
                this.sortBy = SortByConstant.Desc;
                this.orderBy = OrderByConstant.SellingPrice;
                break;
            default:
                this.sortBy = SortByConstant.Asc;
                this.orderBy = OrderByConstant.CreatedAt;
                break;
        }

        this.loadBestSellingProducts(this.currentPage, this.selectedCategoryId);
    }

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: MouseEvent) {
        const targetElement = event.target as HTMLElement;
        if (!targetElement.closest('.custom-select')) {
            this.isDropdownOpen = false;
        }
         const clickedInside = (event.target as HTMLElement).closest('.category-list');
    if (!clickedInside) {
        this.visibleSubCategories.clear(); // Đóng tất cả danh mục con
    }
    }

    // onMouseLeave() {
    //     this.isDropdownOpen = false;
    // }

    // ngOnInit() {
    //     this.loadProductCategories();

    //     this.route.params.subscribe((params) => {
    //         const categoryId = params['id'];

    //         if (categoryId) {
    //             this.selectedCategoryId = categoryId;
    //             this.selectedCategoryName = this.getCategoryName(categoryId);
    //             this.loadBestSellingProducts(this.currentPage, categoryId);
    //         } else {
    //             // Nếu không có id, tải tất cả sản phẩm
    //             this.loadBestSellingProducts(this.currentPage);
    //         }
    //     });
    // }
    ngOnInit() {
        this.loadProductCategories();
    
        // Sử dụng paramMap để lấy id từ URL
        this.route.paramMap.subscribe((params) => {
            const categoryId = params.get('id');
    
            if (categoryId) {
                this.selectedCategoryId = +categoryId; 
               
                this.loadBestSellingProducts(this.currentPage, this.selectedCategoryId);
            } else {
                
                this.loadBestSellingProducts(this.currentPage);
            }
        });
    }
    
    getCategoryName(categoryId: number): string {
        const category = this.categories.find((cat) => cat.Id === categoryId);

        if (category) {
            return category.name;
        } else {
            return '';
        }
    }

    // Hàm tải sản phẩm dựa trên trang hiện tại và tham số SortBy, OrderBy

    loadBestSellingProducts(pageIndex: number, categoryId?: number) {
        const request: any = {

            pageSize: this.pageSize,
            pageIndex: pageIndex,
            status:1
        };

        if (this.sortBy !== null) {
            request.SortBy = this.sortBy;
        }
        request.OrderBy = this.orderBy;

        // Sử dụng categoryId nếu có, nếu không lấy từ selectedCategoryId
        if (categoryId || this.selectedCategoryId) {
            request.CategoryId = categoryId || this.selectedCategoryId;
        }

        this.productService.getProductsT(request).subscribe(
            (response) => {
                this.product = response.data.items;
                // console.log(this.product);

                this.totalproduct = response.data.totalRecords;

                this.totalPage = response.data.totalPages;
                window.scrollTo(0, 0);
            },
            (error) => {
                console.error('Lỗi khi tải sản phẩm:', error);
            }
        );
    }

    // Hàm tính phần trăm giảm giá
    calculateDiscount(importPrice: number, sellingPrice: number): number {
        const discount = (sellingPrice / importPrice) * 100;
        return Math.round(discount);
    }

    // Hàm thay đổi trang
    changePage(page: number) {
        if (page >= 1 && page <= this.totalPage) {
            this.currentPage = page;
            this.loadBestSellingProducts(this.currentPage);
        }
    }

    // Thứ tự bản ghi của 1 trang
    getRecordRangeStart(): number {
        return (this.currentPage - 1) * this.pageSize + 1;
    }

    getRecordRangeEnd(): number {
        const end = this.currentPage * this.pageSize;
        return end > this.totalproduct ? this.totalproduct : end;
    }

    // lấy danh mục sản phẩm
    loadProductCategories() {
        const request: any = {

            pageSize: 1000000,
            pageIndex: 1,
            status:1
        };

        this.productCategory.getProductCategoryAll(request).subscribe(
            (response) => {
                this.categories = response.data;
            },
            (error) => {
                console.error('Lỗi khi tải danh mục sản phẩm:', error);
            }
        );
    }
   

    filterByCategory(categoryId: number) {
        this.selectedCategoryId = categoryId; // Lưu lại CategoryId
        // this.selectedCategoryName = categoryName || 'Tất cả sản phẩm';
        this.loadBestSellingProducts(this.currentPage, this.selectedCategoryId);
    }

    loadCartFromLocalStorage(): void {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            this.cart = JSON.parse(storedCart);
        } else {
            this.cart = [];
        }
    }

    handleAddToCart(product: any) {
        const item = {
            productImage: product.productImages?.[0]?.link,
            productId: product.id,
            productName: product.name,
            quantity: 1,
            price: product.sellingPrice,
        };
        this.cartService.addToCart(item);

        this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Thêm sản phẩm vào giỏ thành công',
        });
    }

    visibleSubCategories: Set<number> = new Set();
   
toggleSubCategory(categoryId: number){
    if (this.visibleSubCategories.has(categoryId)) {
        this.visibleSubCategories.delete(categoryId);
    } else {
        this.visibleSubCategories.add(categoryId);
    }
}


isSubCategoryVisible(categoryId: number): boolean {
    return this.visibleSubCategories.has(categoryId);
}



onMouseLeave(categoryId: number): void {
    this.visibleSubCategories.delete(categoryId);
}
onMouseLeave1(): void {
    this.isDropdownOpen = false;
  }
}
