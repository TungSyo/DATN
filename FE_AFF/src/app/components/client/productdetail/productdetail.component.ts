import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service'; // Thay đổi đường dẫn nếu cần
import { Product } from 'src/app/core/DTOs/products/product'; // Nếu bạn có DTO cho sản phẩm
import { ProductCategoryItem } from 'src/app/core/DTOs/products/product'; // Nếu bạn có DTO cho sản phẩm
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-productdetail',
    templateUrl: './productdetail.component.html',
    styleUrl: './productdetail.component.scss',
    providers: [MessageService],
})
export class ProductdetailComponent {
    product: Product;
    productId: number;
    quantity: number = 1;
    isFullScreen: boolean = false;
    productImages: string[];
    selectedImage: string;
    fullScreenImage: string;
    // selectedImage: string = this.productImages[0];
    currentIndex: number = 0;
    categoryId: number;
    imageUrl: string = environment.baseApiImageUrl;
    productCategoryItem: ProductCategoryItem[];
    productDescription: string;
    safeDescription: SafeHtml;
    isTouching: boolean = false;
    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private cartService: CartService,
        private messageService: MessageService
    ) {}
    ngOnInit(): void {
        // Lấy id từ URL
        this.productId = +this.route.snapshot.paramMap.get('id');
        // console.log(this.productId);
        // '+' để chuyển thành number

        // Gọi hàm để lấy sản phẩm theo id
        this.getProductById(this.productId);
    }
    getProductById(productId: number): void {
        const request = { id: productId };
        this.productService.getProductsById(request).subscribe(
            (response) => {
                // console.log(response);
                this.product = response.data;
                this.categoryId = response.data.categoryId;
                this.productDescription = response.data.description;
                this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(
                    this.productDescription
                );

                const categoryRequest = { CategoryId: this.categoryId, Status:1 };
                this.productService
                    .getProductsT(categoryRequest)
                    .subscribe((categoryResponse) => {
                        this.productCategoryItem = categoryResponse.data.items
                            .filter((item) => item.id !== this.product.id)
                            .slice(0, 4);
                    });

                // Chuyển đổi dữ liệu nhận được thành mảng URL
                if (this.product?.productImages?.length > 0) {
                    this.productImages = this.product.productImages.map(
                        (img) => `${this.imageUrl}/api/file/images/${img.link}`
                    );
                } else {
                    this.productImages = [];
                }

                // Gán ảnh đầu tiên làm ảnh được chọn mặc định
                this.selectedImage = this.productImages[0] || '';
                this.fullScreenImage = this.productImages[0] || '';
                this.fullScreenIndex = 0;
            },
            (error) => {
                console.error('Lỗi khi lấy sản phẩm:', error);
            }
        );
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
    
    goToProductDetail(productId: string) {
        this.router
            .navigate(['/productdetail', productId], { replaceUrl: true })
            .then(() => {
                window.location.reload(); // Tải lại toàn bộ trang
            });
    }

    // Ảnh đang được chọn
    // selectedImage: string = this.productImages[0];
    // fullScreenImage: string = this.productImages[0];
    fullScreenIndex: number = 0;

    @ViewChild('thumbnailContainer') thumbnailContainer: ElementRef;

    // Biến kiểm tra trạng thái chuột
    isMouseDown: boolean = false;
    startX: number = 0;
    scrollLeft: number = 0;

    // Khi nhấn chuột xuống
    onMouseDown(event: MouseEvent): void {
        this.isMouseDown = true;
        this.startX = event.clientX; // Lưu vị trí chuột khi nhấn
        this.scrollLeft = this.thumbnailContainer.nativeElement.scrollLeft; // Lưu vị trí scroll hiện tại
        this.thumbnailContainer.nativeElement.style.cursor = 'grabbing'; // Thay đổi con trỏ thành "grabbing"
    }

    // Khi di chuột và kéo
    onMouseMove(event: MouseEvent): void {
        if (!this.isMouseDown) return; // Chỉ thực hiện khi chuột đang được giữ

        const distance = event.clientX - this.startX; // Tính khoảng cách chuột đã di chuyển
        this.thumbnailContainer.nativeElement.scrollLeft =
            this.scrollLeft - distance; // Cập nhật vị trí scrollLeft
    }

    // Khi nhả chuột
    onMouseUp(): void {
        this.isMouseDown = false;
        this.thumbnailContainer.nativeElement.style.cursor = 'grab';
    }

    // Khi chuột rời khỏi vùng kéo
    onMouseLeave(): void {
        this.onMouseUp();
    }
    // onThumbnailMouseDown(event: MouseEvent): void {
    //     event.stopPropagation(); // Ngừng sự kiện để không gây gián đoạn việc kéo
    //     // Xử lý hành động khi nhấp vào ảnh con (chọn ảnh)
    //   }

    selectImage(image: string, index: number) {
        this.selectedImage = image;
        this.currentIndex = index;
        this.scrollToThumbnail();
    }
    increaseQuantity(): void {
        this.quantity++;
    }

    decreaseQuantity(): void {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    onMouseEnter(event: MouseEvent): void {
        const image = event.target as HTMLImageElement;
        image.style.transform = 'scale(1.5)';
        image.style.transition = 'transform 0.3s ease';
        image.style.opacity = '1';
    }

    // click
    prevImage() {
        if (this.productImages.length <= 1) return;
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.productImages.length - 1;
        }
        this.selectedImage = this.productImages[this.currentIndex];
        this.scrollToThumbnail();
    }

    // Ảnh tiếp theo
    nextImage() {
        if (this.productImages.length <= 1) return;
        if (this.currentIndex < this.productImages.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.selectedImage = this.productImages[this.currentIndex];
        this.scrollToThumbnail();
    }
    // ảnh con hiển thị theo click
    scrollToThumbnail() {
        const thumbnailList = this.thumbnailContainer.nativeElement;
        const thumbnails = thumbnailList.getElementsByClassName('thumbnail');
        const activeThumbnail = thumbnails[this.currentIndex] as HTMLElement;

        if (activeThumbnail) {
            const offsetLeft = activeThumbnail.offsetLeft;
            const thumbnailWidth = activeThumbnail.clientWidth;
            const containerWidth = thumbnailList.clientWidth;

            // Tính toán vị trí cuộn
            const scrollPosition =
                offsetLeft - containerWidth / 2 + thumbnailWidth / 2;
            thumbnailList.scrollTo({
                left: scrollPosition,
                behavior: 'smooth',
            });
        }
    }
    toggleFullScreen(): void {
        this.isFullScreen = !this.isFullScreen;
    }
    closeFullScreen(): void {
        event.stopPropagation();
        this.isFullScreen = false;
    }

    // chuyển ảnh trên lớp giả
    prevImage1(): void {
        event.stopPropagation();
        if (this.productImages.length <= 1) return;
        if (this.fullScreenIndex > 0) {
            this.fullScreenIndex--;
        } else {
            this.fullScreenIndex = this.productImages.length - 1; // Nếu là ảnh đầu tiên, chuyển đến ảnh cuối cùng
        }
        this.fullScreenImage = this.productImages[this.fullScreenIndex];
    }

    // Chuyển ảnh tiếp theo trong chế độ phóng to
    nextImage1(): void {
        event.stopPropagation();
        if (this.productImages.length <= 1) return;
        if (this.fullScreenIndex < this.productImages.length - 1) {
            this.fullScreenIndex++;
        } else {
            this.fullScreenIndex = 0; // Nếu là ảnh cuối cùng, quay lại ảnh đầu tiên
        }
        this.fullScreenImage = this.productImages[this.fullScreenIndex];
    }

    // hàm thêm vào giỏ hàng và mua
    // addToCart(): void {
    //     const quantity = this.quantity > 0 ? this.quantity : 1;

    // hàm thêm vào giỏ hàng và mua
    addToCart(): void {
        const quantity = this.quantity > 0 ? this.quantity : 1;

        // Lấy thông tin sản phẩm và thêm vào giỏ hàng
        const cartItem = {
            productId: this.product.id,
            productName: this.product.name,
            price: this.product.sellingPrice,
            quantity: quantity,
        };
    }

    // Hàm mua ngay
    buyNow(): void {
        const quantity = 1;

        const purchaseItem = {
            productId: this.product.id,
            productName: this.product.name,
            price: this.product.sellingPrice,
            quantity: quantity,
        };
    }

    onTouchStart(event: TouchEvent): void {
        // Ngừng sự kiện mặc định để không gây ảnh hưởng đến các hành động khác
        event.preventDefault();

        this.isTouching = true;
        this.startX = event.touches[0].clientX; // Lấy vị trí bắt đầu từ điểm chạm đầu tiên
        this.scrollLeft = this.thumbnailContainer.nativeElement.scrollLeft; // Lưu lại vị trí scroll hiện tại
    }

    // Khi di chuyển tay (kéo)
    onTouchMove(event: TouchEvent): void {
        if (!this.isTouching) return; // Chỉ thực hiện khi tay đang chạm vào màn hình

        const distance = event.touches[0].clientX - this.startX; // Tính khoảng cách di chuyển
        this.thumbnailContainer.nativeElement.scrollLeft =
            this.scrollLeft - distance; // Cập nhật vị trí scrollLeft
    }

    // Khi nhấc tay lên
    onTouchEnd(): void {
        this.isTouching = false; // Đánh dấu kết thúc thao tác cảm ứng
    }

    handleAddToCart1(product: any) {
        console.log(1)
        const quantity = this.quantity > 0 ? this.quantity : 1;
        const item = {
            productImage: product.productImages?.[0]?.link,
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            price: product.sellingPrice,
        };
        this.cartService.addToCart(item);

        this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Thêm sản phẩm vào giỏ thành công',
        });
    }

    
}
