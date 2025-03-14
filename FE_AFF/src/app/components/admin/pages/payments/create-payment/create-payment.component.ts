import { OrderService } from './../../../../../core/services/order.service';
import {
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ProductService } from 'src/app/core/services/product.service';
import { OptionsFilterProduct } from 'src/app/core/models/options-filter-product';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { OptionsFilterBranchByUser } from 'src/app/core/DTOs/branch/optionsFilterBranchByUser';
import {
    emailValidator,
    noWhitespaceValidator,
    referralCodeNotMatchingPhoneNumberValidator,
} from 'src/app/components/client/shared/validator';
import { AddressService } from 'src/app/core/services/address.service';
import { BankService } from 'src/app/core/services/bank.service';
import { UserService } from 'src/app/core/services/identity/user.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';

export interface WarehouseReceipt {
    id?: number;
    code: string;
    warehouseId: number;
    warehouseName: string;
    productId: number;
    productName: string;
    quantity: number;
    note?: string;
    createdDate: Date;
    createdBy: string;
}

@Component({
    selector: 'app-create-payment',
    templateUrl: './create-payment.component.html',
    styleUrls: ['./create-payment.component.css'],
    // providers: [MessageService],
})
export class CreatePaymentComponent implements OnInit {
    imageUrl: string = environment.baseApiImageUrl;
    @ViewChild('searchInput') searchInput!: ElementRef;
    items: MenuItem[] | undefined;
    datas: any;
    nodes!: any[];
    selectedNodes: any;
    isSubmitting: boolean = false;
    isSubmittingText: string = 'Tạo đơn hàng';
    treeCategory: any[] = [];
    activeBarcode: boolean = false;
    stockInReceipt: any;
    filteredDatas: any;
    showProducts = false;
    isValidForm: boolean = true;
    temporaryDiscountRate: number = 0;
    temporaryDiscountUnit: string = 'VND';
    quantityError: boolean = false;
    displayDiscountModal = false;
    optionsFilterProduct: OptionsFilterProduct = new OptionsFilterProduct();
    // optionsFilterSupplier: OptionsFilterSupplier = new OptionsFilterSupplier();
    optionsFilterBranchByUser: OptionsFilterBranchByUser =
        new OptionsFilterBranchByUser();
    frameNumber: any;
    engineNumber: any;
    public userCurrent: any;
    supplierSelected: any;
    selectedBranchId: any;
    suppliers: any;
    branchError: any;
    branch: any[] = [];
    onBarcode: boolean = false;
    orderForm: FormGroup;

    cities: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    selectedCountryId!: number;
    selectedCityId!: number;
    selectedDistrictId!: number;
    selectedWardId!: number;

    citiesRegister: any[] = [];
    districtsRegister: any[] = [];
    wardsRegister: any[] = [];
    selectedCountryIdRegister!: number;
    selectedCityIdRegister!: number;
    selectedDistrictIdRegister!: number;
    selectedWardIdRegister!: number;
    passwordHash: string;

    banks: any;
    users: any;

    products: any;
    registerForm: FormGroup;
    displayRegisterModal: any;

    bankes = [
        {
            id: 1,
            fullName: 'Ngân hàng Ngoại thương Việt Nam',
            shortName: 'Vietcombank',
        },
        {
            id: 2,
            fullName: 'Ngân hàng Công thương Việt Nam',
            shortName: 'VietinBank',
        },
        {
            id: 3,
            fullName: 'Ngân hàng Đầu tư và Phát triển Việt Nam',
            shortName: 'BIDV',
        },
        {
            id: 4,
            fullName: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam',
            shortName: 'Agribank',
        },
        {
            id: 5,
            fullName: 'Ngân hàng Kỹ thương Việt Nam',
            shortName: 'Techcombank',
        },
        { id: 6, fullName: 'Ngân hàng Quân đội', shortName: 'MB Bank' },
        { id: 7, fullName: 'Ngân hàng Á Châu', shortName: 'ACB' },
        { id: 8, fullName: 'Ngân hàng Tiên Phong', shortName: 'TPBank' },
        {
            id: 9,
            fullName: 'Ngân hàng Việt Nam Thịnh Vượng',
            shortName: 'VPBank',
        },
        {
            id: 10,
            fullName: 'Ngân hàng Phát triển TP.HCM',
            shortName: 'HDBank',
        },
        {
            id: 11,
            fullName: 'Ngân hàng Sài Gòn Thương Tín',
            shortName: 'Sacombank',
        },
        {
            id: 12,
            fullName: 'Ngân hàng Thương mại Cổ phần Đông Á',
            shortName: 'DongA Bank',
        },
        {
            id: 13,
            fullName: 'Ngân hàng Bưu điện Liên Việt',
            shortName: 'LienVietPostBank',
        },
        { id: 14, fullName: 'Ngân hàng Quốc tế Việt Nam', shortName: 'VIB' },
        { id: 15, fullName: 'Ngân hàng Sài Gòn', shortName: 'SCB' },
        {
            id: 16,
            fullName: 'Ngân hàng Đại chúng Việt Nam',
            shortName: 'PVcomBank',
        },
        { id: 17, fullName: 'Ngân hàng Bắc Á', shortName: 'Bac A Bank' },
        {
            id: 18,
            fullName: 'Ngân hàng Thương mại Cổ phần Xuất nhập khẩu Việt Nam',
            shortName: 'Eximbank',
        },
        {
            id: 19,
            fullName: 'Ngân hàng Thương mại Cổ phần An Bình',
            shortName: 'ABBank',
        },
        { id: 20, fullName: 'Ngân hàng Bảo Việt', shortName: 'BaoViet Bank' },
        { id: 21, fullName: 'Ngân hàng Nam Á', shortName: 'Nam A Bank' },
        { id: 22, fullName: 'Ngân hàng Việt Á', shortName: 'VietABank' },
        { id: 23, fullName: 'Ngân hàng Sài Gòn Hà Nội', shortName: 'SHB' },
        { id: 24, fullName: 'Ngân hàng Đông Nam Á', shortName: 'SeABank' },
        { id: 25, fullName: 'Ngân hàng Kiên Long', shortName: 'KienlongBank' },
        { id: 26, fullName: 'Ngân hàng Hàng Hải', shortName: 'MSB' },
        { id: 27, fullName: 'Ngân hàng Phương Đông', shortName: 'OCB' },
        {
            id: 28,
            fullName: 'Ngân hàng Bản Việt',
            shortName: 'VietCapitalBank',
        },
        {
            id: 29,
            fullName: 'Ngân hàng Nhà nước Việt Nam',
            shortName: 'State Bank of Vietnam (SBV)',
        },
    ];

    filteredBankes: any;

    constructor(
        private productService: ProductService,
        private addressService: AddressService,
        private messageService: MessageService,
        private userService: UserService,
        private router: Router,
        private orderService: OrderService,
        private bankService: BankService,
        private formBuilder: FormBuilder,
        private authService: AuthService
    ) {
        this.orderForm = this.formBuilder.group({
            name: [null, [Validators.required, noWhitespaceValidator()]],
            phoneNumber: [null, [Validators.required, noWhitespaceValidator()]],
            cityId: [null],
            cityName: [null],
            districtId: [null],
            districtName: [null],
            wardId: [null],
            userId: [null, Validators.required],
            wardName: [null],
            address: [null],
            note: [null],
            paymentAccountReceiptId: [null, Validators.required],
            paymentAccountReceiptName: [null],
            paymentMethod: [0],
        });

        this.registerForm = this.formBuilder.group({
            name: [null, [Validators.required, noWhitespaceValidator()]],
            phoneNumber: [null, [Validators.required, noWhitespaceValidator()]],
            email: [
                null,
                [
                    Validators.required,
                    Validators.email,
                    emailValidator,
                    noWhitespaceValidator(),
                ],
            ],
            password: [null, [Validators.required, noWhitespaceValidator()]],
            citizenIdentification: [
                null,
                [Validators.required, noWhitespaceValidator()],
            ],
            referralCode: [null, referralCodeNotMatchingPhoneNumberValidator()],
            dateOfBirth: [null],
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

        this.filteredBankes = [...this.bankes];
    }

    ngOnInit() {
        this.items = [
            { label: 'Kho hàng' },
            { label: 'Nhập kho', route: '/inputtext' },
            { label: 'Tạo phiếu nhập kho', route: '/inputtext' },
        ];
        this.stockInReceipt = {
            supplierId: '',
            note: '',
            inventoryStockInDetails: [],
            createdAt: new Date().toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }),

            totalPrice: 0, // Tổng số tiền phải trả cho tất cả các sản phẩm/dịch vụ
            totalDiscountAmount: 0, // Tổng số tiền giảm giá đã được áp dụng
            totalAmountPaid: 0, // Tổng số tiền khách hàng đã thanh toán
            customerPayment: 0, // Số tiền mà khách hàng đã thanh toán trong lần giao dịch hiện tại
            moneyReturn: 0, // Số tiền phải trả lại cho khách hàng nếu họ thanh toán dư
            discountRate: 0, // Giá trị giảm giá (có thể là phần trăm (%) hoặc số tiền cụ thể)
            discountUnit: 'VND', // Đơn vị của giá trị giảm giá, ví dụ như 'VND' hoặc '%'
            paymentMethod: 'cash', // Phương thức thanh toán mà khách hàng sử dụng (ví dụ: 'cash', 'credit')
        };
        // this.loadBranches();
        this.loadUsers();
        this.loadBanks();
        this.getCitiesByCountry(1);
        this.getCitiesByCountryRegister(1);
    }

    loadUsers(): void {
        this.userService.getPaging({}).subscribe((users) => {
            this.users = users.data.items;
        });
    }

    shortenName(name: string, maxLength: number): string {
        if (name.length > maxLength) {
            return name.slice(0, maxLength) + '...'; // Cắt ngắn và thêm ...
        }
        return name;
    }
    loadBanks(): void {
        this.bankService.getPaging().subscribe((response) => {
            this.banks = response.data.items;
        });
    }

    onBranchChange() {
        this.branchError = !this.selectedBranchId;
    }

    searchBank(event: any): void {
        const keyword = event.query?.trim().toLowerCase() || ''; // Kiểm tra keyword có hợp lệ
        if (!keyword) {
            this.filteredBankes = []; // Trả về danh sách rỗng nếu không có từ khoá
            return;
        }

        // Lọc ngân hàng dựa trên keyword
        this.filteredBankes = this.bankes.filter((bank) =>
            bank.shortName?.toLowerCase().includes(keyword)
        );
    }

    async onProductSearch(event: Event) {
        const input = event.target as HTMLInputElement;
        const searchTerm = input.value.toLowerCase();
        this.optionsFilterProduct.pageIndex = 1;
        this.optionsFilterProduct.pageSize = 50;
        this.optionsFilterProduct.KeyWord = searchTerm.toLowerCase();
        this.loadProducts();
    }

    showProductList(): void {
        if (this.onBarcode) {
            this.showProducts = false;
        } else {
            this.showProducts = true;
            this.loadProducts();
        }
    }

    async loadProducts() {
        this.showProducts = true;
        this.optionsFilterProduct.pageIndex = 1;
        this.optionsFilterProduct.pageSize = 50;
        this.optionsFilterProduct.Status = 1;
        this.optionsFilterProduct.branchId = this.selectedBranchId?.id;
        this.productService
            .getProductsT(this.optionsFilterProduct)
            .subscribe((item) => {
                this.products = item.data.items;
            });
    }
    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const searchContainer = document.querySelector('.box-search');
        if (searchContainer && !searchContainer.contains(target)) {
            this.showProducts = false;
        }
    }

    onProductListClick(event: MouseEvent): void {
        this.showProducts = true;
    }

    onNodeSelect(event: any) {
        console.log(event);
        let label = document.querySelector(
            '.category-select .p-treeselect-label'
        );
        if (label) {
            label.innerHTML = this.selectedNodes?.name || '';
        }
    }

    createWarehouseReceipt(receipt: WarehouseReceipt): void {}

    addToCart(item: any): void {
        const existingDetail = this.stockInReceipt.inventoryStockInDetails.find(
            (detail: any) => {
                return detail.productId == item.id;
            }
        );
        if (existingDetail) {
            existingDetail.quantity += 1;
            existingDetail.total =
                existingDetail.quantity * existingDetail.price;
        } else {
            const newDetail = {
                productId: item.id,
                productImage: item.productImages?.[0]?.link,
                productName: item.name,
                productVariantId: item.productVariantId,
                productType: item.productType,
                quantity: item.productType === 1 ? 0 : 1,
                productCode: item.productCode ? '' : '',
                price: item.sellingPrice,
                unit: item.unitName,
                total: item.productType === 1 ? 0 : item.sellingPrice * 1,
                frameNumber: '',
                engineNumber: '',
            };
            this.stockInReceipt.inventoryStockInDetails.push(newDetail);
        }
        this.updatePaymentInfo();
        this.showProducts = false;
        this.searchInput.nativeElement.value = '';
    }

    updateTotal(data: any) {
        data.total = data.price * data.quantity;
        this.checkValidity();
        this.updatePaymentInfo();
    }

    updatePaymentInfo(): void {
        const totalPrice = this.stockInReceipt.inventoryStockInDetails.reduce(
            (sum, detail) => sum + detail.total,
            0
        );
        this.stockInReceipt.totalPrice = totalPrice;
        this.stockInReceipt.totalAmountPaid =
            totalPrice - Math.round(this.stockInReceipt.totalDiscountAmount);
        this.stockInReceipt.moneyReturn =
            this.stockInReceipt.customerPayment -
            this.stockInReceipt.totalAmountPaid;

        this.checkValidity();
    }

    removeProduct(index: number) {
        this.stockInReceipt.inventoryStockInDetails.splice(index, 1);
        this.updatePaymentInfo();
    }

    calculateTotalDiscount(): number {
        this.stockInReceipt.discountRate = this.temporaryDiscountRate;
        this.stockInReceipt.discountUnit = this.temporaryDiscountUnit;
        // Giả định bạn muốn tính toán giảm giá dựa trên tỷ lệ hoặc giá trị
        if (this.stockInReceipt.discountUnit === '%') {
            return (
                (this.stockInReceipt.totalPrice *
                    this.stockInReceipt.discountRate) /
                100
            );
        } else {
            return this.stockInReceipt.discountRate;
        }
    }
    validateQuantity(data: any) {
        if (data.quantity > 100) {
            this.quantityError = true;
            data.quantity = 100;
        } else {
            this.quantityError = false;
        }
    }

    removeImeiItem(product: any, index: number) {
        product.productImeis.splice(index, 1);
        product.quantity = product.productImeis.length;
        product.total = product.quantity * product.price;
        this.updatePaymentInfo();
    }

    onSubmit() {
        // this.isSubmitting = true;
        // this.isSubmittingText = 'Đang xử lí ...';

        console.log(1);
        const products = this.stockInReceipt.inventoryStockInDetails.map(
            (product) => ({
                productId: product.productId,
                unitPrice: product.price,
                quantity: product.quantity,
            })
        );

        console.log(products);
        if (products.length > 0) {
            console.log(23);

            if (this.orderForm.valid) {
                if (this.isSubmitting) {
                    return;
                }

                this.isSubmitting = true; // Disable the form submission
                this.isSubmittingText = 'Đang xử lí ...';
                const formData = {
                    phoneNumber: this.orderForm.value.phoneNumber,
                    shippingAddress: [
                        this.orderForm.value.address,
                        this.orderForm.value.wardId?.name,
                        this.orderForm.value.districtId?.name,
                        this.orderForm.value.cityId?.name,
                    ]
                        .filter((part) => part)
                        .join(', '),
                    paymentAccountReceiptId:
                        this.orderForm.value.paymentAccountReceiptId,
                    userId: this.orderForm.value.userId?.id,
                    userName: this.orderForm.value.name,
                    note: this.orderForm.value.note,
                    paymentType: this.orderForm.value.paymentMethod,
                    orderDetails: products,
                };
                console.log(this.orderForm.value.paymentMethod);
                if (this.orderForm.value.paymentMethod == 0) {
                    this.orderService.createBank(formData).subscribe(
                        (response) => {
                            this.isSubmitting = false;
                            this.isSubmittingText = 'Tạo đơn hàng';
                            if (response.status) {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Chú ý',
                                    detail: 'Tạo đơn hàng thành công',
                                });
                                setTimeout(() => {
                                    this.router.navigate([
                                        `/admin/pages/payments/show-payments`,
                                    ]);
                                }, 700);
                                // setTimeout(() => {
                                //     this.router.navigate([
                                //         `/manual-payment/${response.data.id}`,
                                //     ]);
                                // }, 700);
                            } else {
                                this.messageService.add({
                                    severity: 'warn',
                                    summary: 'Chú ý',
                                    detail: 'Đơn hàng đang tồn tại',
                                });
                            }
                        },
                        (error) => {
                            this.isSubmitting = false;
                            this.isSubmittingText = 'Tạo đơn hàng';
                            // this.isSubmitting = false;
                            // this.isSubmittingText = 'Đặt hàng';
                        }
                    );
                } else {
                    this.orderService.createCommission(formData).subscribe(
                        (response) => {
                            // this.isSubmitting = false;
                            this.isSubmittingText = 'ĐẶT HÀNG';
                            if (response.status) {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Chú ý',
                                    detail: 'Tạo đơn hàng thành công',
                                });
                                setTimeout(() => {
                                    this.router.navigate([
                                        '/admin/pages/payments/show-payments',
                                    ]);
                                }, 1000);
                            } else {
                                this.messageService.add({
                                    severity: 'warn',
                                    summary: 'Chú ý',
                                    detail: response.message,
                                });
                            }
                        },
                        (error) => {
                            // this.isSubmitting = false;
                            // this.isSubmittingText = 'Đặt hàng';
                        }
                    );
                }
            } else {
                this.orderForm.markAllAsTouched();
            }
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Chú ý',
                detail: 'Chưa có sản phẩm trong giỏ hàng',
            });
        }
    }

    filterUserSuggestions(event: any): void {
        const query = event.query.toLowerCase();
        this.userService
            .getPaging({
                pageIndex: 1,
                pageSize: 10,
                keyword: event.query.toLowerCase(),
            })
            .subscribe((users) => {
                this.users = users.data.items;
            });
        // this.users = this.users.filter(
        //     (user) =>
        //         user.name.toLowerCase().includes(query) ||
        //         user.phoneNumber.toLowerCase().includes(query)
        // );
    }

    onBarcodeClick() {
        this.activeBarcode = !this.activeBarcode;
        if (this.onBarcode) {
            this.messageService.add({
                severity: 'success',
                summary: '',
                detail: 'Chuyển sang chế độ thường',
            });
        } else {
            this.messageService.add({
                severity: 'success',
                summary: '',
                detail: 'Chuyển sang chế độ barcode',
            });
        }
        this.onBarcode = !this.onBarcode;
    }
    // onToggleActiveBarcode() {}

    checkValidity() {
        if (this.stockInReceipt.inventoryStockInDetails.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Chú ý',
                detail: 'Phiếu nhập chưa có sản phẩm',
            });
            this.isValidForm = false;
            return;
        }

        // Kiểm tra giá trị thanh toán và tổng giảm giá
        if (
            this.stockInReceipt.customerPayment ===
            this.stockInReceipt.totalAmountPaid
        ) {
            this.stockInReceipt.isValidMoney = false;
            delete this.stockInReceipt.isMessageValidMoney;
        } else {
            this.stockInReceipt.isValidMoney = true;
            this.stockInReceipt.isMessageValidMoney =
                'Bằng tiền cần trả nhà cung cấp';
        }

        // Khởi tạo Set để kiểm tra trùng số khung và số máy
        const frameNumbers = new Set<string>(); // Set cho số khung
        const engineNumbers = new Set<string>(); // Set cho số máy
        const duplicateMessages: string[] = [];

        // Kiểm tra các sản phẩm và IMEI
        this.stockInReceipt.inventoryStockInDetails.forEach((product) => {
            if (product.quantity === 0) {
                product.isValid = true;
                product.isValidMessage = 'Số lượng > 0';
            } else {
                product.isValid = false;
                delete product.isValidMessage; // Loại bỏ isValidMessage nếu không còn lỗi
            }

            if (product.productImeis) {
                product.productImeis.forEach((imei) => {
                    // Kiểm tra số khung
                    if (imei.frameNumber) {
                        if (frameNumbers.has(imei.frameNumber)) {
                            imei.isValid = true;
                            imei.isValidMessage = `Số khung ${imei.frameNumber} đã tồn tại trong danh sách`;
                            duplicateMessages.push(imei.isValidMessage);
                        } else {
                            frameNumbers.add(imei.frameNumber);
                        }
                    }

                    // Kiểm tra số máy
                    if (imei.engineNumber) {
                        if (engineNumbers.has(imei.engineNumber)) {
                            imei.isValid = true;
                            imei.isValidMessage = `Số máy ${imei.engineNumber} đã tồn tại trong danh sách`;
                            duplicateMessages.push(imei.isValidMessage);
                        } else {
                            engineNumbers.add(imei.engineNumber);
                        }
                    }

                    // Kiểm tra cả hai số khung và số máy chưa được nhập
                    if (!imei.frameNumber || !imei.engineNumber) {
                        imei.isValid = true;
                        if (!imei.frameNumber && !imei.engineNumber) {
                            imei.isValidMessage =
                                'Vui lòng nhập số khung và số máy';
                        } else if (!imei.frameNumber) {
                            imei.isValidMessage = 'Vui lòng nhập số khung';
                        } else if (!imei.engineNumber) {
                            imei.isValidMessage = 'Vui lòng nhập số máy';
                        }
                    } else {
                        // Kiểm tra số khung và số máy đã tồn tại trong hệ thống chưa
                        // this.stockInService
                        //     .checkExistEngineAndFrame(
                        //         imei.frameNumber,
                        //         imei.engineNumber
                        //     )
                        //     .subscribe(
                        //         (exists) => {
                        //             if (exists.data) {
                        //                 imei.isValid = true;
                        //                 imei.isValidMessage =
                        //                     'Số khung hoặc số máy đã tồn tại';
                        //                 duplicateMessages.push(
                        //                     imei.isValidMessage
                        //                 );
                        //             } else {
                        //                 imei.isValid = false;
                        //                 delete imei.isValidMessage; // Loại bỏ isValidMessage nếu không còn lỗi
                        //             }
                        //         },
                        //         (error) => {
                        //             console.error(
                        //                 'Error checking engine and frame number:',
                        //                 error
                        //             );
                        //         }
                        //     );
                        // delete imei.isValidMessage; // Loại bỏ isValidMessage nếu không còn lỗi
                    }
                });
            }
        });

        // Kiểm tra tính hợp lệ của form
        this.isValidForm =
            this.stockInReceipt.inventoryStockInDetails?.every((product) => {
                // Kiểm tra số lượng sản phẩm
                if (product.quantity === 0) {
                    return false;
                }

                // Kiểm tra IMEI nếu có
                if (product.productImeis) {
                    return product.productImeis.every((imei) => !imei.isValid);
                }

                // Kiểm tra tính hợp lệ của sản phẩm
                return !product.isValid;
            }) && !this.stockInReceipt.isValidMoney;

        // Hiển thị thông báo nếu có trùng lặp
        if (duplicateMessages.length > 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: duplicateMessages.join(', '),
            });
        }

        if (this.isValidForm) {
            // Form hợp lệ
        } else {
            // Form không hợp lệ
        }
    }

    getCitiesByCountry(countryId: number) {
        this.addressService
            .getCitiesByIdCountry({ id: countryId })
            .subscribe((cities) => {
                this.cities = cities.data;
                //console.log(cities)
            });
    }

    getDistrictsByCity(cityId: number) {
        this.addressService
            .getDistrictsByIdCity({ cityId: cityId })
            .subscribe((districts) => {
                this.districts = districts.data;
            });
    }

    getWardsByDistrict(districtId: number) {
        this.addressService
            .getWardsByIdDistrict({ districtId: districtId })
            .subscribe((wards) => {
                this.wards = wards.data;
            });
    }

    onCountryChange(countryId: number) {
        this.selectedCountryId = countryId;
        this.getCitiesByCountry(countryId);
        this.districts = [];
        this.wards = [];
    }

    onCityChange(data: any) {
        this.selectedCityId = data.value.id;
        this.getDistrictsByCity(data.value.id);
        this.districts = [];
        this.wards = [];

        console.log(this.districts);
        this.orderForm.get('wardId')?.setValue(null);
        this.orderForm.get('districtId')?.setValue(null);
    }

    onDistrictChange(districtId: any) {
        this.selectedDistrictId = districtId.value.id;
        this.getWardsByDistrict(districtId.value.id);
        this.wards = [];
        this.orderForm.get('wardId')?.setValue(null);
    }

    onClearCity() {
        this.orderForm.get('wardId')?.setValue(null);
        this.orderForm.get('districtId')?.setValue(null);

        this.districts = [];
        this.wards = [];
    }

    onClearDistrict() {
        this.wards = [];
        this.orderForm.get('wardId')?.setValue(null);
    }

    onClearWard() {
        this.orderForm.get('wardId')?.setValue(null);
    }

    // Address Register Form

    getCitiesByCountryRegister(countryId: number) {
        this.addressService
            .getCitiesByIdCountry({ id: countryId })
            .subscribe((cities) => {
                this.citiesRegister = cities.data;
                //console.log(cities)
            });
    }

    getDistrictsByCityRegister(cityId: number) {
        this.addressService
            .getDistrictsByIdCity({ cityId: cityId })
            .subscribe((districts) => {
                this.districtsRegister = districts.data;
            });
    }

    getWardsByDistrictRegister(districtId: number) {
        this.addressService
            .getWardsByIdDistrict({ districtId: districtId })
            .subscribe((wards) => {
                this.wardsRegister = wards.data;
            });
    }

    onCountryChangeRegister(countryId: number) {
        this.selectedCountryIdRegister = countryId;
        this.getCitiesByCountryRegister(countryId);
        this.districtsRegister = [];
        this.wardsRegister = [];
    }

    onCityChangeRegister(data: any) {
        this.selectedCityIdRegister = data.value.id;
        this.getDistrictsByCityRegister(data.value.id);
        this.districtsRegister = [];
        this.wardsRegister = [];

        this.registerForm.get('wardId')?.setValue(null);
        this.registerForm.get('districtId')?.setValue(null);
    }

    onDistrictChangeRegister(districtId: any) {
        this.selectedDistrictIdRegister = districtId.value.id;
        this.getWardsByDistrictRegister(districtId.value.id);
        this.wardsRegister = [];
        this.registerForm.get('wardId')?.setValue(null);
    }

    onClearCityRegister() {
        this.registerForm.get('wardId')?.setValue(null);
        this.registerForm.get('districtId')?.setValue(null);
        this.districtsRegister = [];
        this.wardsRegister = [];
    }

    onClearDistrictRegister() {
        this.wardsRegister = [];
        this.registerForm.get('wardId')?.setValue(null);
    }

    onClearWardRegister() {
        this.registerForm.get('wardId')?.setValue(null);
    }

    handleRegister() {
        if (this.registerForm.valid) {
            if (this.isSubmitting) {
                return;
            }
            this.isSubmitting = true; // Disable the form submission
            this.isSubmittingText = 'Đang xử lí ...';
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
                cityId: this.registerForm.value.cityId?.id,
                cityName: this.registerForm.value.cityName,
                districtId: this.registerForm.value.districtId?.id,
                districtName: this.registerForm.value.districtName,
                wardId: this.registerForm.value.wardId?.id,
                wardName: this.registerForm.value.wardName,
                address: this.registerForm.value.address,
                bankName: this.registerForm.value.bankName?.shortName,
                directCommission: {
                    amount: 0,
                },
                bankAccountNumber: this.registerForm.value.bankAccountNumber,
            };

            console.log(formData);
            this.authService.registerCustomer(formData).subscribe(
                (response) => {
                    this.isSubmitting = false;
                    this.isSubmittingText = 'Tạo tài khoản';
                    if (response.status) {
                        this.displayRegisterModal = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Đăng ký thành công',
                        });
                    } else {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Chú ý',
                            detail: response.message,
                        });
                    }
                },
                (error) => {
                    this.isSubmitting = false;
                    this.isSubmittingText = 'Tạo tài khoản';

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Lỗi hệ thống',
                        detail: '',
                    });
                    console.error('Error creating account:', error);
                }
            );
        } else {
            this.registerForm.markAllAsTouched();
        }
    }
}
