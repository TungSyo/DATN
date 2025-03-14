import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/core/DTOs/products/product';
import { CartService } from 'src/app/core/services/cart.service';
import { ProductApiService } from 'src/app/core/services/product-home.service';
import { IProduct } from 'src/app/types/IProduct';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ProductCategoryService } from 'src/app/core/services/product-category.service';
import { ProductService } from 'src/app/core/services/product.service';
import { BannerService } from 'src/app/core/services/content/banner.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [MessageService],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
    imageUrl: string = environment.baseApiImageUrl;
    products: IProduct[] = [];
    filteredProducts: IProduct[] = [];
    selectedCategory: string = 'All';
    news: any[] = []; // Mảng chứa dữ liệu tin tức
    currentNewsIndex: number = 0;
    displayedNews: any[] = [];
    newsPerPage: number = 3;
    totalDots: number = 0;
    banners: any;

    constructor(
        private router: Router,
        private productApiService: ProductApiService,
        private cartService: CartService,
        private messageService: MessageService,
        private sanitizer: DomSanitizer,
        private product: ProductCategoryService,
        private bannerService: BannerService,
        private productservice: ProductService
    ) {}

    ngOnInit() {
        this.loadDefaultProducts();
        this.loadCategories();
        this.startSlideShow();
        this.loadBestSellingProducts();
        this.loadNews(); // Gọi phương thức loadNews để lấy tin tức
        this.sliderImages = [...this.sliderImages, ...this.sliderImages]; // Nhân đôi danh sách hình ảnh
        this.startAutoSlide();
        this.loadBanner();
        this.news = this.news.map((news) => ({
            ...news,
            safeContent: this.sanitizer.bypassSecurityTrustHtml(news.content),
        }));
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

    ngAfterViewInit(): void {
        const overlay = document.querySelector('.page-overlay');
        if (overlay) {
            setTimeout(() => {
                overlay.classList.add('hide');
                setTimeout(() => overlay.remove(), 1000);
            }, 200);
        }
        // Phần đếm số
        const counters = document.querySelectorAll('.stat-number');
        const speed = 100; // Tốc độ tăng số

        const startCounting = (entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting) {
                const target = entry.target as HTMLElement;
                const endValue = +target.getAttribute('data-target')!;
                let current = 0;

                const updateCount = () => {
                    current += Math.ceil(endValue / speed);
                    if (current < endValue) {
                        target.textContent = current.toLocaleString(); // Định dạng số với dấu phẩy
                        requestAnimationFrame(updateCount);
                    } else {
                        target.textContent = `${endValue.toLocaleString()}+`; // Định dạng số cuối cùng với dấu phẩy và dấu cộng
                    }
                };

                updateCount();
                counterObserver.unobserve(target);
            }
        };

        const counterObserver = new IntersectionObserver(
            (entries) => entries.forEach(startCounting),
            { threshold: 0.5 }
        );

        counters.forEach((counter) => counterObserver.observe(counter));

        // Phần hiệu ứng hiện mượt mà cho các phần tử khi cuộn
        const elements = document.querySelectorAll('.fade-in');

        const fadeInObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        fadeInObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        elements.forEach((element) => fadeInObserver.observe(element));
    }

    goToNews() {
        this.router.navigate(['/news']);
    }

    defaultProducts: any[] = [];
    loadBestSellingProducts(
        data: Record<string, number | string> | null = null
    ) {
        this.productApiService.getBestSellingProducts(data).subscribe(
            (res) => {
                if (res.data && res.data.length > 0) {
                    // Sản phẩm bán chạy có sẵn
                    this.products = res.data.filter(
                        (product) => product.totalQuantitySold > 0
                    );
                    this.defaultProducts = []; // Nếu có sản phẩm bán chạy, ẩn sản phẩm mặc định
                } else {
                    // Nếu không có sản phẩm bán chạy, tải sản phẩm mặc định
                    this.products = [];
                    this.loadDefaultProducts(res.data.items); // Gọi thêm sản phẩm mặc định
                }
            },
            (error) => {
                console.error('Lỗi khi tải sản phẩm:', error);
            }
        );
    }

    loadDefaultProducts(data: Record<string, number | string> | null = null) {
        this.productservice.getProductsT(data).subscribe(
            (res) => {
                this.defaultProducts = res.data.items; // Giả sử API trả về sản phẩm chưa bán chạy
            },
            (error) => {
                console.error('Lỗi khi tải sản phẩm mặc định:', error);
            }
        );
    }

    loadCategories() {
        this.product.getProductCategoryAll().subscribe(
            (res) => {
                this.categories = [];

                // Hàm đệ quy để flatten danh mục và chỉ lấy cấp 1
                const flattenCategoriesByLevel = (
                    categories: any[],
                    currentLevel: number
                ) => {
                    categories.forEach((category) => {
                        if (currentLevel === 1) {
                            // Lấy tất cả các cấp 1
                            this.categories.push({
                                name: category.name,
                                id: category.id,
                            });
                            this.categoryMap[category.name] = category.id; // Lưu ánh xạ từ tên sang ID
                        }
                        if (category.children && category.children.length > 0) {
                            flattenCategoriesByLevel(
                                category.children,
                                currentLevel + 1
                            );
                        }
                    });
                };

                flattenCategoriesByLevel(res.data, 1); // Bắt đầu từ cấp 1
                console.log(this.categories); // Danh sách chỉ có các cấp 1
            },
            (error) => {
                console.error('Lỗi khi tải danh mục:', error);
            }
        );
    }

    categories: { name: string; id: number }[] = [];
    categoryMap: { [key: string]: number } = {};

    filterProductsByCategory(category: string) {
        this.selectedCategory = category;

        if (category === 'All') {
            // Nếu chọn "All", tải tất cả sản phẩm của danh mục cấp 1
            this.loadDefaultProducts({}); // Tải tất cả sản phẩm
        } else {
            // Nếu chọn danh mục cụ thể, lọc theo categoryId
            const categoryId = this.categoryMap[category]; // Lấy ID từ ánh xạ
            this.loadDefaultProducts({ CategoryId: categoryId });
        }
    }

    updateDisplayedNews() {
        const startIndex = this.currentNewsIndex * this.newsPerPage;
        this.displayedNews = this.news.slice(
            startIndex,
            startIndex + this.newsPerPage
        );
    }

    // Thêm phương thức loadNews để lấy tin tức
    loadNews() {
        this.productApiService
            .getNews({ pageSize: 50, pageIndex: 1 })
            .subscribe(
                (res) => {
                    if (res && Array.isArray(res.data.items)) {
                        this.news = res.data.items.map((item: any) => ({
                            ...item,
                            isActive: item.isActive !== false, // Mặc định là true nếu không xác định
                            safeContent: this.sanitizer.bypassSecurityTrustHtml(
                                item.content
                            ),
                        }));
                        this.totalDots = Math.ceil(
                            this.filteredNews.length / this.newsPerPage
                        );
                        this.updateDisplayedNews();
                    } else {
                        this.news = [];
                    }
                },
                (error) => {
                    console.error('Lỗi khi tải tin tức:', error);
                }
            );
    }

    get filteredNews() {
        return this.news.filter((newsItem) => newsItem.isActive); // Chỉ giữ tin tức có isActive = true
    }

    changeNews(index: number) {
        this.currentNewsIndex = index;
        this.updateDisplayedNews();
    }

    ngOnDestroy() {
        this.stopAutoSlide();
    }

    startAutoSlide() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 2500);
    }

    stopAutoSlide() {
        clearInterval(this.slideInterval);
    }

    nextSlide() {
        this.currentSliderIndex += 1;
        if (this.currentSliderIndex >= this.sliderImages.length / 2) {
            this.currentSliderIndex = 0; // Quay lại đầu chuỗi để tiếp tục lặp lại
        }
    }

    prevSlide() {
        this.currentSliderIndex -= 1;
        if (this.currentSliderIndex < 0) {
            this.currentSliderIndex = this.sliderImages.length / 2 - 1; // Quay lại cuối chuỗi
        }
    }

    //animation frontend
    bannerImages = [
        'assets/image/anhhonivy/anhbanner1.jpg',
        'assets/image/anhhonivy/anhbanner2.jpg',
        'assets/image/anhhonivy/anhbanner3.jpg',
    ];
    currentImageIndex = 0;
    currentSliderIndex = 0;
    isVideoVisible = false;
    slideInterval: any;
    sliderimageInterval: any;

    // phần slide ảnh
    sliderImages: string[] = [
        'assets/image/anhhonivy/anhbanner1.jpg',
        'assets/image/anhhonivy/anhbanner2.jpg',
        'assets/image/anhhonivy/anhbanner3.jpg',
        'assets/image/anhhonivy/anhbanner1.jpg',
        'assets/image/anhhonivy/anhbanner2.jpg',
    ];

    startSlideShow() {
        this.slideInterval = setInterval(() => {
            this.currentImageIndex =
                (this.currentImageIndex + 1) % this.bannerImages.length;
        }, 1500);
    }

    stopSlideShow() {
        clearInterval(this.slideInterval);
    }

    showVideo() {
        this.isVideoVisible = true;
    }

    hideVideo() {
        this.isVideoVisible = false;
    }

    setImage(index: number) {
        this.stopSlideShow(); // Dừng slideshow khi người dùng nhấp vào thanh
        this.currentImageIndex = index; // Cập nhật hình ảnh tương ứng
        this.startAutoSlide(); // Bắt đầu lại slideshow sau khi chọn hình ảnh
    }

    loadBanner(): void {
        this.bannerService.getPaging({}).subscribe(
            (res) => {
                if (res.data && res.data.items) {
                    console.log(res.data.items);

                    this.bannerImages = res.data.items.map(
                        (item: any) => item.image
                    );
                    console.log(this.bannerImages);
                }
            },
            (error) => {
                console.error('Lỗi khi tải banner:', error);
            }
        );
    }
}
