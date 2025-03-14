import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator, noWhitespaceValidator } from '../shared/validator';
import { AddressService } from 'src/app/core/services/address.service';
import { BankService } from 'src/app/core/services/bank.service';
import { OrderService } from 'src/app/core/services/order.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { V } from '@fullcalendar/core/internal-common';
import { VoucherService } from 'src/app/core/services/voucher.service';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css'],
    providers: [MessageService],
})
export class PaymentComponent implements OnInit {
    apiQR =
        'https://img.vietqr.io/image/vcb-9383716351-print.jpg?amount=10000&accountName=PHAM%20XUAN%20MANH&addInfo=ab2k1312';
    orderForm: FormGroup;
    isDropdownCity: boolean = false;
    isDropdownBank: boolean = false;
    isSubmitting: boolean = false;
    isSubmittingText: string = 'ĐẶT HÀNG';
    isDropdownDistrict: boolean = false;
    isDropdownWard: boolean = false;
    dataToSendOtp: any;
    cities: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    banks: any[] = [];
    cart: any[] = [];
    totalAmount: any;
    cartItems: any[] = [];
    selectedCity: any = null;
    userCurrent: any = null;
    countOrderSuccess: number = null;
    filteredCities: any;
    filteredDistricts: any;
    filteredWards: any;
    listVoucher: any[] = [];
    codeVoucherSelected: any;
    errorMessageVoucher: any;
    constructor(
        private formBuilder: FormBuilder,
        private addressService: AddressService,
        private orderService: OrderService,
        private router: Router,
        private bankService: BankService,
        private messageService: MessageService,
        private voucherService: VoucherService,
        private cartService: CartService,
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
            wardName: [null],
            voucherId: [null],
            address: [null],
            note: [null],
            paymentAccountReceiptId: [],
            paymentAccountReceiptName: [null, Validators.required],
            paymentMethod: [0],
        });
        this.orderForm
            .get('paymentMethod')
            ?.valueChanges.subscribe((method) => {
                const paymentAccountReceiptNameControl = this.orderForm.get(
                    'paymentAccountReceiptName'
                );
                if (method === 1 || method === 2 || method === 3) {
                    // Nếu phương thức thanh toán là 1, bỏ validate
                    paymentAccountReceiptNameControl?.clearValidators();
                } else {
                    // Ngược lại, thêm validate `required`
                    paymentAccountReceiptNameControl?.setValidators([
                        Validators.required,
                    ]);
                }
                // Cập nhật trạng thái để áp dụng thay đổi
                paymentAccountReceiptNameControl?.updateValueAndValidity();
            });

        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
            this.orderService
                .countOrderSuccess({ userId: user?.id })
                .subscribe((order) => {
                    this.countOrderSuccess = order.data;
                });
        });

        this.loadCities();
        this.loadBanks();
    }

    ngOnInit() {
        this.checkout();
        this.calculateTotalAmount();
    }

    calculateTotalVV(): number {
        let total = this.totalAmount;

        if (this.listVoucher.length > 0) {
            total -= this.listVoucher[0].voucherAmount;
        }

        if (this.countOrderSuccess) {
        }

        // Đảm bảo tổng số tiền không âm
        return Math.max(total, 0);
    }

    handleSelectVoucher(): void {
        this.voucherService
            .applyVoucher({ VoucherCode: this.codeVoucherSelected })
            .subscribe((voucher) => {
                if (voucher.status) {
                    this.listVoucher = [];
                    this.listVoucher.push(voucher.data);
                    this.errorMessageVoucher = null;
                } else {
                    this.errorMessageVoucher = voucher.message;
                }
            });
    }

    checkout() {
        this.cartItems = this.cartService.getSelectedItemsForCheckout();
    }

    calculateTotalAmount() {
        this.totalAmount = this.cartItems
            .filter((item) => item.status) // Lọc các sản phẩm có status là true
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    calculateTotal(): number {
        return this.cart.reduce((total, item) => {
            return total + item.sellingPrice * item.quantity;
        }, 0);
    }

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

        const clickedInsideBank =
            (event.target &&
                (event.target as HTMLElement).closest(
                    '.bank-inner .dropdown-list'
                )) ||
            (event.target && (event.target as HTMLElement).closest('.bank'));
        if (!clickedInsideBank) {
            this.isDropdownBank = false;
        }
    }

    loadBanks(): void {
        this.bankService.getPaging().subscribe((response) => {
            this.banks = response.data.items;
        });
    }

    handleSelectBank(city: any, event: MouseEvent) {
        this.orderForm.patchValue({
            paymentAccountReceiptId: city.id,
            paymentAccountReceiptName: city.bankName,
        });

        this.isDropdownBank = false;
    }

    loadCities(): void {
        this.addressService
            .getCitiesByIdCountry({ id: 1 })
            .subscribe((item) => {
                this.cities = item.data;
                this.filteredCities = [...this.cities];
            });
    }

    loadDistricts(city: any): void {
        this.addressService
            .getDistricts({ cityId: city.id })
            .subscribe((item) => {
                console.log(city.id);
                this.districts = item.data;
                this.filteredDistricts = [...this.districts];
            });
    }

    loadWards(city: any): void {
        this.addressService
            .getWards({ districtId: city.id })
            .subscribe((item) => {
                console.log(item.data);
                this.wards = item.data;
                this.filteredWards = [...this.wards];
            });
    }

    handleSelectCity(city: any, event: MouseEvent) {
        this.orderForm.patchValue({
            cityName: city.name,
            cityId: city.id,
        });

        this.orderForm.patchValue({
            districtName: null,
            districtId: null,
        });
        this.orderForm.patchValue({
            wardName: null,
            wardId: null,
        });
        this.loadDistricts(city);
        this.isDropdownCity = false;
    }

    handleSelectDistrict(city: any, event: MouseEvent) {
        this.orderForm.patchValue({
            districtName: city.name,
            districtId: city.id,
        });
        this.orderForm.patchValue({
            wardName: null,
            wardId: null,
        });
        this.loadWards(city);
        this.isDropdownDistrict = false;
    }

    handleSelectWard(city: any, event: MouseEvent) {
        this.orderForm.patchValue({
            wardName: city.name,
            wardId: city.id,
        });
        this.isDropdownWard = false;
    }

    showCities() {
        this.isDropdownCity = true;
    }

    removeVoucher(index: number): void {
        this.listVoucher = [];
    }

    onSubmit() {
        if (this.userCurrent == null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Chú ý',
                detail: 'Vui lòng đăng nhập trước khi thanh toán',
            });
        } else {
            if (this.orderForm.valid) {
                if (this.isSubmitting) {
                    return;
                }
                this.isSubmitting = true;
                this.isSubmittingText = 'Đang xử lí ...';
                const orderDetails = this.cartItems
                    .filter((item) => item.status)
                    .map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.price,
                    }));
                const formData = {
                    phoneNumber: this.orderForm.value.phoneNumber,
                    shippingAddress: [
                        this.orderForm.value.address,
                        this.orderForm.value.wardName,
                        this.orderForm.value.districtName,
                        this.orderForm.value.cityName,
                    ]
                        .filter((part) => part) // Filters out null, undefined, or empty values
                        .join(', '),
                    paymentAccountReceiptId:
                        this.orderForm.value.paymentAccountReceiptId,
                    userId: this.userCurrent?.id,
                    userName: this.orderForm.value.name,
                    note: this.orderForm.value.note,
                    orderDetails: orderDetails,
                    paymentType: this.orderForm.value.paymentMethod,
                    voucherCode: this.listVoucher?.[0]?.code,
                };
                if (this.orderForm.value.paymentMethod == 0) {
                    this.orderService.createBank(formData).subscribe(
                        (response) => {
                            if (response.status) {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Chú ý',
                                    detail: 'Tạo đơn hàng thành công',
                                });
                                this.cartService.clearCart();
                                setTimeout(() => {
                                    this.router.navigate([
                                        `/manual-payment/${response.data.id}`,
                                    ]);
                                    this.isSubmittingText = 'ĐẶT HÀNG';
                                    this.isSubmitting = false;
                                }, 700);
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
                            this.isSubmittingText = 'Đặt hàng';
                        }
                    );
                } else if (this.orderForm.value.paymentMethod == 3) {
                    this.orderService
                        .createPayWithCommision50Percent(formData)
                        .subscribe(
                            (response) => {
                                this.isSubmitting = false;
                                this.isSubmittingText = 'ĐẶT HÀNG';
                                if (response.status) {
                                    this.cartService.clearCart();
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: 'Chú ý',
                                        detail: 'Tạo đơn hàng thành công',
                                    });
                                    setTimeout(() => {
                                        this.router.navigate([
                                            '/order-history-user',
                                        ]); // Đường dẫn trang đích
                                    }, 1000); // Chờ 1 giây để người dùng thấy thông báo
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
                                this.isSubmittingText = 'Đặt hàng';
                            }
                        );
                } else {
                    this.orderService.createCommission(formData).subscribe(
                        (response) => {
                            this.isSubmitting = false;
                            this.isSubmittingText = 'ĐẶT HÀNG';
                            if (response.status) {
                                this.cartService.clearCart();
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Chú ý',
                                    detail: 'Tạo đơn hàng thành công',
                                });
                                setTimeout(() => {
                                    this.router.navigate([
                                        '/order-history-user',
                                    ]); // Đường dẫn trang đích
                                }, 1000); // Chờ 1 giây để người dùng thấy thông báo
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
                            this.isSubmittingText = 'Đặt hàng';
                        }
                    );
                }
            } else {
                this.orderForm.markAllAsTouched();
            }
        }
    }

    searchCity(keyword: string) {
        this.filteredCities = this.cities.filter((city) =>
            city.name.toLowerCase().includes(keyword.toLowerCase())
        );
    }
    searchDistrict(keyword: string) {
        this.filteredDistricts = this.districts.filter((city) =>
            city.name.toLowerCase().includes(keyword.toLowerCase())
        );
    }
    searchWard(keyword: string) {
        this.filteredWards = this.wards.filter((city) =>
            city.name.toLowerCase().includes(keyword.toLowerCase())
        );
    }
}
