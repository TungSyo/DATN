import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    Component,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { AddressService } from 'src/app/core/services/address.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import roleConstant from 'src/app/core/constants/role.constant';
import { LoginComponent } from 'src/app/components/client/auth/login/login.component';
import { RegisterComponent } from 'src/app/components/client/auth/register/register.component';
import { Router } from '@angular/router';
import { Page } from 'src/app/core/enums/page.enum';
import { MessageService } from 'primeng/api';
import { ProductCategory } from 'src/app/core/DTOs/productcategory/productCategory';
import { ProductCategoryService } from 'src/app/core/services/product-category.service';
import { an } from '@fullcalendar/core/internal-common';
import { ProductCategoryItem } from 'src/app/core/DTOs/products/product';
import { Product } from 'src/app/core/DTOs/products/product';
import { ProductService } from 'src/app/core/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';
// import {SearchProduct} from 'src/app/core/constants/order-by.constant'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
    isDropdownOpen: boolean = false;
    isLoggedIn: boolean = false;
    isSuccessRegistered: boolean = true;
    registerFormStatus: boolean = false;
    isDropdownCity: boolean = false;
    isDropdownDistrict: boolean = false;
    isDropdownWard: boolean = false;
    cities: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    selectedCity: any = null;
    registerForm: FormGroup;
    loginForm: FormGroup;
    isShowLoginForm: any = false;
    isShowRegisterForm: any = false;
    isMenuVisible = false;
    isMenuVisible2 = false;
    menuItems: any;
    isOpen: boolean = false;
    userCurrent: any;
    categories: ProductCategory[] = [];
    selectedCategoryId: number = null;
    selectedCategoryName: string = 'Chọn danh mục';
    searchQuery: string;
    isMenuVisibleMb: boolean = false;
    cartItemCount: any;
    @Output() sidebarToggled = new EventEmitter<void>();
    constructor(
        private addressService: AddressService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService,
        private productCategory: ProductCategoryService,
        private productService: ProductService,
        private cartService: CartService
    ) {
        this.registerForm = this.formBuilder.group({
            name: [null, [Validators.required]],
            phoneNumber: [null, [Validators.required]],
            email: [null, [Validators.required]],
            password: [null, [Validators.required]],
            referralCode: [null],
            citizenIdentification: [null, [Validators.required]],
            dateOfBirth: [null, [Validators.required]],
            cityId: [null],
            cityName: [null],
            districtId: [null],
            districtName: [null],
            wardId: [null],
            wardName: [null],
            address: [null],
            personalTaxCode: [null],
            bankName: [null],
            bankAccountNumber: [null],
        });

        this.loginForm = this.formBuilder.group({
            email: [
                null,
                [
                    Validators.required,
                    Validators.pattern(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                    ),
                ],
            ],
            password: [null, [Validators.required]],
            rememberMe: false,
        });

        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
        });

        this.cartService.cart$.subscribe((items) => {
            this.cartItemCount = items.length;
        });
    }
    toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    scrollToProducts(): void {
        const element = document.getElementById('featured-products');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    closeDropdown(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (!target.closest('.product__search-category')) {
            this.isDropdownOpen = false;
        }
    }

    handleToggleShow() {
        this.isMenuVisible = !this.isMenuVisible;
        console.log(this.isMenuVisible);
    }

    handleToggleShowMb() {
        this.isMenuVisibleMb = !this.isMenuVisibleMb;
    }

    toggleClose() {
        this.isMenuVisible = false;
        this.isMenuVisibleMb = false;
    }
    handleToggleShow2() {
        this.isMenuVisible2 = !this.isMenuVisible2;
    }

    toggleClose2() {
        this.isMenuVisible2 = false;
    }

    handleToggleStatus(): void {
        // Thêm logic cho hàm này tại đây
        console.log('Toggle status');
    }

    ngOnInit() {
        this.loadProductCategories();
        const email = localStorage.getItem('email');

        if (!email) {
            // Nếu không có email trong localStorage
            this.isSuccessRegistered = false;
        }

        this.menuItems = [
            {
                label: 'Trang chủ',
                link: '/',
                children: [],
            },
            {
                label: 'Giới thiệu',
                link: '/news',
                children: [],
            },
            {
                label: 'Sản phẩm',
                link: '/products',
                isOpen: false,
                children: [
                    { label: 'Sữa hạt dinh dưỡng', link: '/products' },
                    { label: 'Sữa hạt và bé', link: '/products' },
                    { label: 'Sữa hạt bệnh lí', link: '/products' },
                ],
            },
            {
                label: 'Tin tức',
                link: '/newss',
                children: [],
            },
            {
                label: 'Tài liệu',
                link: '/doccument',
                isOpen: false,
                children: [
                    {
                        label: 'Về kết quả thử nghiệm',
                        link: '#',
                        isOpen: false,
                        children: [
                            {
                                label: 'Kết quả 1',
                                link: 'https://api.honivy.com:6003/document/KQ%20-%20%C4%90%E1%BB%A8C%20MINH%20HO%C3%80NG%20(NGU%E1%BB%92N%20NHN-8795%20)%20%20-%20AEJ6240800091-1.pdf',
                                target: '_blank',
                            },
                            {
                                label: 'Kết quả 2',
                                link: 'https://api.honivy.com:6003/document/SCAN%20-%20%C4%90%E1%BB%A8C%20MINH%20HO%C3%80NG%20%20-%20AEJ6240800091-1.pdf',
                                target: '_blank',
                            },
                        ],
                    },
                    {
                        label: 'Về chứng nhận',
                        link: '#',
                        isOpen: false,
                        children: [
                            {
                                label: 'Chứng nhận đăng ký',
                                link: 'https://api.honivy.com:6003/document/CHỨNG%20NHẬN%20ĐĂNG%20KÝ%20KD.pdf',
                                target: '_blank',
                            },
                            {
                                label: 'Chứng nhận HACCP',
                                link: 'https://api.honivy.com:6003/document/2.%20HACCP%20NHÀ%20MÁY%20ORGANIC.pdf',
                                target: '_blank',
                            },
                            {
                                label: 'Chứng nhận GMP',
                                link: 'https://api.honivy.com:6003/document/5.%20GMP%20NHÀ%20MÁY%20ORGANIC%20(1).pdf',
                                target: '_blank',
                            },
                            {
                                label: 'Chứng nhận ISO',
                                link: 'https://api.honivy.com:6003/document/3.%20ISO%2022000%20NHÀ%20MÁY%20ORGANIC.pdf',
                                target: '_blank',
                            },
                            {
                                label: 'Chứng nhận FDA',
                                link: 'https://api.honivy.com:6003/document/4.%20FDA%20NHÀ%20MÁY%20ORGANIC.pdf',
                                target: '_blank',
                            },
                        ],
                    },
                    {
                        label: 'Về kem tan mỡ',
                        link: 'https://api.honivy.com:6003/document/Kem%20tan%20m%E1%BB%A1%20honivy.pdf',
                        target: '_blank',
                    },
                ],
            },
            {
                label: 'Liên hệ',
                link: '/contact',
                children: [],
            },
        ];
        

        this.isLoggedIn = !!this.authService.getAuthTokenLocalStorage();
    }
    
    toggleSubMenu(item: any, event: Event) {
        event.preventDefault();
        item.isOpen = !item.isOpen;
    }

    isSubmenuOpen(item: any): boolean {
        return item.isOpen;
    }

    toggleSidebar() {
        this.isOpen = !this.isOpen;
    }

    

    // @HostListener('document:click', ['$event'])
    // onDocumentClick2(event: Event) {

    // }

    // @HostListener('document:click', ['$event'])
    // onClick(event: MouseEvent): void {
    // }

    @ViewChild(LoginComponent) loginComponent!: LoginComponent;
    @ViewChild(RegisterComponent) registerComponent!: RegisterComponent;

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const clickedInside =
            (event.target &&
                (event.target as HTMLElement).closest(
                    '.city-address .dropdown-list'
                )) ||
            (event.target && (event.target as HTMLElement).closest('.city'));
        if (!clickedInside) {
            this.isDropdownCity = false;
        }

        const clickedInsideDistrict =
            (event.target &&
                (event.target as HTMLElement).closest(
                    '.district-address .dropdown-list'
                )) ||
            (event.target &&
                (event.target as HTMLElement).closest('.district'));
        if (!clickedInsideDistrict) {
            this.isDropdownDistrict = false;
        }

        const clickedInsideWard =
            (event.target &&
                (event.target as HTMLElement).closest(
                    '.ward-address .dropdown-list'
                )) ||
            (event.target && (event.target as HTMLElement).closest('.ward'));
        if (!clickedInsideWard) {
            this.isDropdownWard = false;
        }

        const sidebar = document.querySelector('.sidebar');
        const sidebarMenu = sidebar?.querySelector('.sidebar__menu');
        const buttonSidebar = document.querySelector(
            '.header__mb-right-sidebar'
        );

        if (
            buttonSidebar?.contains(event.target as Node) ||
            sidebar?.contains(event.target as Node)
        ) {
            return;
        }

        if (this.isOpen && sidebar && !sidebar.contains(event.target as Node)) {
            this.isOpen = false;
        }

        const targetSearchProduct = event.target as HTMLElement;
        const isClickInside =
            targetSearchProduct.closest('.header__shop-icon-item') ||
            targetSearchProduct.closest('.user-menu.dropdown-menu');

        // Nếu nhấp bên ngoài menu và biểu tượng, ẩn menu
        if (!isClickInside) {
            this.isMenuVisible = false;
        }
        // const clickedInsideMenuUser =
        //     (event.target &&
        //         (event.target as HTMLElement).closest(
        //             '.user-menu.dropdown-menu'
        //         )) ||
        //     (event.target &&
        //         (event.target as HTMLElement).closest(
        //             '.header__mb-right-item'
        //         ));
        // if (!clickedInsideMenuUser) {
        //     this.isMenuVisibleMb = false;
        // }
    }

    handleToggleShowRegister(): void {
        if (this.registerFormStatus) {
        } else {
            this.loadCities();
        }
        // this.registerFormStatus = !this.registerFormStatus;
        this.registerComponent.handleShowRegister();
    }

    handleToggleShowLogin(): void {
        this.registerComponent.handleShowLogin();
    }

    loadCities(): void {
        this.addressService
            .getCitiesByIdCountry({ id: 1 })
            .subscribe((item) => {
                this.cities = item.data;
                console.log(item.data);
            });
    }

    loadDistricts(city: any): void {
        this.addressService
            .getDistricts({ cityId: city.id })
            .subscribe((item) => {
                console.log(city.id);
                this.districts = item.data;
            });
    }

    loadWards(city: any): void {
        this.addressService
            .getWards({ districtId: city.id })
            .subscribe((item) => {
                console.log(item.data);
                this.wards = item.data;
            });
    }

    handleSelectCity(city: any, event: MouseEvent) {
        this.registerForm.patchValue({
            cityName: city.name,
            cityId: city.id,
        });

        this.registerForm.patchValue({
            districtName: null,
            districtId: null,
        });

        this.registerForm.patchValue({
            wardName: null,
            wardId: null,
        });
        this.loadDistricts(city);
        this.isDropdownCity = false;
    }

    handleSelectDistrict(city: any, event: MouseEvent) {
        this.registerForm.patchValue({
            districtName: city.name,
            districtId: city.id,
        });
        this.registerForm.patchValue({
            wardName: null,
            wardId: null,
        });
        this.loadWards(city);
        this.isDropdownDistrict = false;
    }

    handleSelectWard(city: any, event: MouseEvent) {
        this.registerForm.patchValue({
            wardName: city.name,
            wardId: city.id,
        });
        this.isDropdownWard = false;
    }

    showCities() {
        console.log(1);
        this.isDropdownCity = true;
    }

    onSubmit() {
        if (this.registerForm.valid) {
            const formData = {
                name: this.registerForm.value.name,
                phoneNumber: this.registerForm.value.phoneNumber,
                email: this.registerForm.value.email,
                password: this.registerForm.value.password,
                citizenIdentification:
                    this.registerForm.value.citizenIdentification,
                dateOfBirth: this.registerForm.value.dateOfBirth,
                personalTaxCode: this.registerForm.value.personalTaxCode,
                referralCode: this.registerForm.value.referralCode,
                cityId: this.registerForm.value.cityId,
                cityName: this.registerForm.value.cityName,
                districtId: this.registerForm.value.districtId,
                districtName: this.registerForm.value.districtName,
                wardId: this.registerForm.value.wardId,
                wardName: this.registerForm.value.wardName,
                address: this.registerForm.value.address,
                bankName: this.registerForm.value.bankName,
                directCommission: {
                    amount: 0,
                },
                bankAccountNumber: this.registerForm.value.bankAccountNumber,
            };

            this.authService.registerUser(formData).subscribe(
                (response) => {
                    if (formData.email) {
                        localStorage.setItem('email', formData.email);
                    }
                    this.isSuccessRegistered = true;
                },
                (error) => {
                    console.error('Error creating branch:', error);
                }
            );
        } else {
            this.registerForm.markAllAsTouched();
        }
    }

    onLoginSubmit() {
        if (this.loginForm.valid) {
            const formData = {
                email: this.loginForm.value.email,
                password: this.loginForm.value.password,
            };

            this.authService.login(formData).subscribe((res) => {
                if (res.status == true) {
                    this.authService.setAuthTokenLocalStorage(res.data.token);
                    this.isLoggedIn = true;
                    setTimeout(() => {
                        this.authService
                            .fetchUserCurrent()
                            .subscribe((data) => {
                                this.authService.setUserCurrent(data.data);
                                if (
                                    this.authService.hasRole(
                                        roleConstant.admin
                                    ) ||
                                    this.authService.hasRole(
                                        roleConstant.master
                                    ) ||
                                    this.authService.hasRole(
                                        roleConstant.employee
                                    )
                                ) {
                                    // this.messageService.add({
                                    //     severity: 'success',
                                    //     summary: 'Thành công',
                                    //     detail: 'Đăng nhập thành công',
                                    // });
                                    // this.router.navigate([Page.Dashboard]);
                                } else {
                                    this.authService.setAuthTokenLocalStorage(
                                        null
                                    );
                                    this.authService.setUserCurrent(null);
                                    this.isLoggedIn = false;
                                    // this.messageService.add({
                                    //     severity: 'warning',
                                    //     summary: 'Cảnh báo',
                                    //     detail: 'Bạn không có quyền',
                                    // });
                                }
                            });
                        // this.router.navigate([Page.Login]);
                    }, 320);
                } else {
                    // this.messageService.add({
                    //     severity: 'error',
                    //     summary: 'Thất bại',
                    //     detail: res.message,
                    // });
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    handleLogout() {
        this.authService.logout().subscribe(
            (res) => {
                if (res.status) {
                    this.authService.setUserCurrent(null);
                    this.authService.setAuthTokenLocalStorage(null);
                    this.router.navigate([Page.Home]);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thông báo',
                        detail: 'Thành công',
                    });
                    this.isMenuVisible = false;
                    this.isMenuVisibleMb = false;
                }
            },
            (exception) => {
                this.isMenuVisible = false;
                this.isMenuVisibleMb = false;
                this.authService.setUserCurrent(null);
                this.authService.setAuthTokenLocalStorage(null);
                this.router.navigate([Page.Home]);
                this.messageService.add({
                    severity: 'warning',
                    summary: 'Thông báo',
                    detail: 'Thành công',
                });
            }
        );
    }

    //  hàm lấy danh mục sản phẩm
    loadProductCategories() {
        const request: any = {
            pageSize: 1000000,
            pageIndex: 1,
            status: 1,
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
    // loadProductCategories() {
    //     this.productCategory.getProductCategoryAll().subscribe(
    //         (response) => {
    //             this.categories = response.data.items;
    //         },
    //         (error) => {
    //             console.error('Lỗi khi tải danh mục sản phẩm:', error);
    //         }
    //     );
    // }

    //
    filterByCategory(categoryId: number, categoryName: string) {
        this.selectedCategoryId = categoryId;
        this.selectedCategoryName = categoryName;
        this.isDropdownOpen = true;

        // console.log(this.searchQuery,this.selectedCategoryId );
    }
    resetCategory() {
        this.selectedCategoryName = 'Chọn danh mục';
        this.selectedCategoryId = null;
        this.isDropdownOpen = true;
    }
    resetSearch() {
        setTimeout(() => {
            this.searchQuery = '';
            this.selectedCategoryName = 'Chọn danh mục';
            this.selectedCategoryId = null;
        }, 0);
    }

    getSelectedCategoryAndSearchValue() {
        const request: any = {
            // pageSize: this.pageSize,
            // pageIndex: pageIndex,
        };
        if (this.selectedCategoryId && this.searchQuery) {
            request.body = {
                CategoryId: this.selectedCategoryId,
                KeyWord: this.searchQuery,
            };
        } else if (this.selectedCategoryId) {
            request.body = {
                CategoryId: this.selectedCategoryId,
            };
        } else if (this.searchQuery) {
            request.body = {
                KeyWord: this.searchQuery,
            };
        }
    }
    @HostListener('document:click', ['$event'])
    handleClickOutside(event: MouseEvent) {
        const targetElement = event.target as HTMLElement;
        if (!targetElement.closest('.product__search-category')) {
            this.isDropdownOpen = false;
        }
        if (
            !targetElement.closest('.header__shop-icon-item') &&
            !targetElement.closest('.user-menu')
        ) {
            this.isMenuVisible = false;
        }
        if (
            !targetElement.closest('.header__mb-right-sidebar') &&
            !targetElement.closest('.open')
        ) {
            this.isOpen = false;
        }
    }
    onMouseLeave() {
        this.isDropdownOpen = false;
    }

    onMouseLeaveMb() {
        this.isMenuVisibleMb = false;
    }

    onSearchEnter() {
        if (this.searchQuery && this.searchQuery.trim()) {
            const queryParams = this.getQueryParams();
            if (queryParams) {
                this.router.navigate(['/productsearch'], { queryParams });
                this.resetSearch();
            }
        } else {
            this.router.navigate(['/productsearch']);
        }
    }
    getQueryParams() {
        const queryParams: any = {};

        if (this.searchQuery) {
            queryParams.KeyWord = this.searchQuery;
        }

        if (this.selectedCategoryId) {
            queryParams.CategoryId = this.selectedCategoryId;
        }

        // Trả về đối tượng queryParams chỉ khi có tham số hợp lệ
        return Object.keys(queryParams).length ? queryParams : null;
    }
    onMouseLeave1(): void {
        this.isMenuVisible = false;
    }
}
