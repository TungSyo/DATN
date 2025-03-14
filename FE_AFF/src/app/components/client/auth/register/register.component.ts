import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Component, HostListener, OnInit } from '@angular/core';
import { AddressService } from 'src/app/core/services/address.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import roleConstant from 'src/app/core/constants/role.constant';
import { MessageService } from 'primeng/api';
import {
    emailValidator,
    noWhitespaceValidator,
    referralCodeNotMatchingPhoneNumberValidator,
} from '../../shared/validator';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
    isSuccessRegistered: boolean = false;
    registerFormStatus: boolean = false;
    isDropdownCity: boolean = false;
    isSubmitting: boolean = false;
    isSubmittingText: string = 'Tạo tài khoản';
    isDropdownDistrict: boolean = false;
    isDropdownWard: boolean = false;
    isDropdownBank: boolean = false;

    dataToSendOtp: any;
    cities: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    selectedCity: any = null;
    registerForm: FormGroup;
    loginForm: FormGroup;
    isShowRegisterForm: any = false;

    otp1: string = '';
    otp2: string = '';
    otp3: string = '';
    otp4: string = '';
    otp5: string = '';
    otp6: string = '';
    errorMessage: string = '';
    username: string = '';
    isVerifyOtpIn: boolean = false;
    messages: any[] = [];

    filteredCities: any;
    filteredDistricts: any;
    filteredWards: any;
    filteredBankes: any;

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

    constructor(
        private addressService: AddressService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService
    ) {
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
            isActive: [false],
        });

        this.loginForm = this.formBuilder.group({
            email: [
                null,
                [Validators.required, Validators.email, emailValidator],
            ],
            password: [null, [Validators.required]],
            rememberMe: false,
        });
    }

    handleShowRegister() {
        this.isShowRegisterForm = true;
    }

    ngOnInit() {
        const email = localStorage.getItem('email');

        if (!email) {
            // Nếu không có email trong localStorage
            this.isSuccessRegistered = false;
        }
        this.loadCities();
        this.filteredBankes = [...this.bankes];
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

    searchBank(keyword: string) {
        this.filteredBankes = this.bankes.filter((city) =>
            city.shortName.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    handleRedirectLoginToRegister() {
        this.loginForm.reset();
        this.isShowLoginForm = false;
        this.isShowRegisterForm = true;
    }

    handleRedirectRegisterToLogin() {
        this.registerForm.reset();
        this.isShowLoginForm = true;
        this.isShowRegisterForm = false;
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
                    '.bankes .dropdown-list'
                )) ||
            (event.target && (event.target as HTMLElement).closest('.bank'));
        if (!clickedInsideBank) {
            this.isDropdownBank = false;
        }
    }

    handleToggleStatus(): void {
        if (this.registerFormStatus) {
        } else {
            this.loadCities();
        }
        this.registerFormStatus = !this.registerFormStatus;
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
                this.districts = item.data;
                this.filteredDistricts = [...this.districts];
            });
    }

    loadWards(city: any): void {
        this.addressService
            .getWards({ districtId: city.id })
            .subscribe((item) => {
                this.wards = item.data;
                this.filteredWards = [...this.wards];
            });
    }

    handleSelectBank(city: any, event: MouseEvent) {
        this.registerForm.patchValue({
            bankName: city.shortName,
        });
        this.isDropdownBank = false;
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
            if (this.isSubmitting) {
                return;
            }
            this.isSubmitting = true;
            this.isSubmittingText = 'Đang xử lí ...';
            if (this.registerForm.value.isActive) {
                const formData = {
                    name: this.registerForm.value.name,
                    phoneNumber: this.registerForm.value.phoneNumber,
                    email: this.registerForm.value.email,
                    password: this.registerForm.value.password,
                    citizenIdentification:
                        this.registerForm.value.citizenIdentification,
                    dateOfBirth: this.registerForm.value?.dateOfBirth || null,
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
                    bankAccountNumber:
                        this.registerForm.value.bankAccountNumber,
                };
                this.authService.registerUser(formData).subscribe(
                    (response) => {
                        this.isSubmitting = false;
                        this.isSubmittingText = 'Tạo tài khoản';
                        if (response.status) {
                            this.dataToSendOtp = formData.email;
                            this.isSuccessRegistered = true;
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
                this.isSubmitting = false;
                this.isSubmittingText = 'Tạo tài khoản';
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Chú ý',
                    detail: 'Vui lòng tích chọn điều khoản',
                });
            }
        } else {
            this.registerForm.markAllAsTouched();
        }
    }

    valCheck: string[] = ['rememberMe'];
    password!: string;
    isShowLoginForm: any = false;

    handleShowLogin() {
        this.isShowLoginForm = true;
    }
    handleDisableLogin() {
        this.isShowLoginForm = false;
    }
    onSubmitLogin() {
        if (this.loginForm.valid) {
            const formData = {
                email: this.loginForm.value.email,
                password: this.loginForm.value.password,
                rememberMe: true,
            };
            this.authService.login(formData).subscribe((res) => {
                if (res.status == true) {
                    this.authService.setAuthTokenLocalStorage(res.data);
                    this.authService.fetchUserCurrent().subscribe((data) => {
                        this.authService.setUserCurrent(data.data);
                    });
                    this.loginForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Đăng nhập thành công',
                    });
                    this.isShowLoginForm = false;
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Thất bại',
                        detail: res.message,
                    });
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    closeFormOtp() {
        this.isSuccessRegistered = false;
        this.otp1 = '';
        this.otp2 = '';
        this.otp3 = '';
        this.otp4 = '';
        this.otp5 = '';
        this.otp6 = '';
        this.errorMessage = '';
    }

    get maskedEmail(): string {
        const [localPart, domain] = this.username.split('@');
        if (localPart.length <= 3) {
            return `***@${domain}`;
        }
        return `${localPart.slice(0, 3)}***@${domain}`;
    }

    verifyOtp() {
        if (this.isVerifyOtpIn) {
            return;
        }
        const otp = `${this.otp1}${this.otp2}${this.otp3}${this.otp4}${this.otp5}${this.otp6}`;
        if (otp.length !== 6) {
            this.errorMessage = 'Vui lòng nhập mã OTP đầy đủ.';
            return;
        }
        this.isVerifyOtpIn = true;
        this.authService
            .verifyOtp({ email: this.dataToSendOtp, otp: otp })
            .subscribe(
                (response) => {
                    this.isVerifyOtpIn = false;
                    if (response.data) {
                        this.isSuccessRegistered = false;
                        this.isShowRegisterForm = false;

                        // Reset form OTP
                        this.otp1 = '';
                        this.otp2 = '';
                        this.otp3 = '';
                        this.otp4 = '';
                        this.otp5 = '';
                        this.otp6 = '';
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Đăng ký thành công',
                        });

                        this.registerForm.reset();
                        // this.router.navigate(['/']);
                    } else {
                        this.errorMessage =
                            'Mã xác thực không hợp lệ. Vui lòng kiểm tra lại.';
                    }
                },
                (error) => {
                    this.isVerifyOtpIn = false;
                    // Reset form OTP
                    this.otp1 = '';
                    this.otp2 = '';
                    this.otp3 = '';
                    this.otp4 = '';
                    this.otp5 = '';
                    this.otp6 = '';
                    if (error.StatusCode === 4002) {
                        this.errorMessage =
                            'Mã xác thực không hợp lệ. Vui lòng kiểm tra lại.';
                    } else {
                        this.errorMessage =
                            'Mã xác thực không hợp lệ. Vui lòng kiểm tra lại';
                    }
                }
            );
    }

    resendOtp() {
        if (this.isVerifyOtpIn) {
            return;
        }

        this.isVerifyOtpIn = true;
        // this.authService.login2(this.username).subscribe(
        //     (response) => {
        //         this.isVerifyOtpIn = false;
        //         if (response.isSucceeded) {
        //             this.messages = [
        //                 {
        //                     severity: 'success',
        //                     summary: 'Thành công',
        //                     detail: 'OTP mới đã được gửi!',
        //                     life: 4000,
        //                 },
        //             ];
        //             this.errorMessage = ''; // Ẩn thông báo lỗi nếu có
        //         } else {
        //             this.errorMessage =
        //                 'Gửi lại OTP không thành công: ' + response.message;
        //         }
        //     },
        //     (error) => {
        //         this.isVerifyOtpIn = false;
        //         this.errorMessage = 'Đã xảy ra lỗi: ' + error.message;
        //     }
        // );
    }

    onPaste(event: ClipboardEvent) {
        const clipboardData =
            event.clipboardData || (window as any).clipboardData;
        const pastedText = clipboardData.getData('text');

        if (pastedText.length === 6) {
            this.otp1 = pastedText[0];
            this.otp2 = pastedText[1];
            this.otp3 = pastedText[2];
            this.otp4 = pastedText[3];
            this.otp5 = pastedText[4];
            this.otp6 = pastedText[5];
            this.errorMessage = '';
            event.preventDefault();
        }
    }

    validateOtp() {
        const otp = `${this.otp1}${this.otp2}${this.otp3}${this.otp4}${this.otp5}${this.otp6}`;
        if (otp.length === 6) {
            this.errorMessage = ''; // Ẩn thông báo lỗi khi nhập đủ mã OTP
        } else {
            this.errorMessage = 'Vui lòng nhập mã OTP đầy đủ.';
        }
    }

    moveToNext(currentInput: HTMLInputElement, nextInput: HTMLInputElement) {
        if (currentInput.value.length === currentInput.maxLength) {
            nextInput.focus();
        }
    }

    moveToPrev(event: KeyboardEvent, prevInput: HTMLInputElement) {
        if (
            event.key === 'Backspace' &&
            (event.target as HTMLInputElement).value.length === 0
        ) {
            prevInput.focus();
        }
    }

    clearErrorMessage() {
        this.errorMessage = ''; // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại số OTP
    }

    onlyNumbers(event: any) {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
        }
    }

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.verifyOtp();
        }
    }
}
