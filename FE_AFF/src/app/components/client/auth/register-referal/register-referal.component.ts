import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator, noWhitespaceValidator } from '../../shared/validator';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { AddressService } from 'src/app/core/services/address.service';

@Component({
    selector: 'app-register-referal',
    templateUrl: './register-referal.component.html',
    styleUrls: ['./register-referal.component.css'],
})
export class RegisterReferalComponent implements OnInit {
    registerForm: FormGroup;

    isSuccessRegistered: boolean = false;
    registerFormStatus: boolean = false;
    isDropdownCity: boolean = false;
    isSubmitting: boolean = false;
    isSubmittingText: string = 'Tạo tài khoản';
    isDropdownDistrict: boolean = false;
    isDropdownWard: boolean = false;
    dataToSendOtp: any;
    cities: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    selectedCity: any = null;
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
    referralCode: any;
    filteredCities: any;
    filteredDistricts: any;
    filteredWards: any;
    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService,
        private addressService: AddressService,
        private route: ActivatedRoute
    ) {
        this.route.queryParamMap.subscribe((params) => {
            this.referralCode = params.get('referralCode');
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
            referralCode: [this.referralCode],
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
    }

    ngOnInit() {
        this.loadCities();
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
                    this.isSubmitting = false;
                    this.isSubmittingText = 'Tạo tài khoản';
                    if (response.status) {
                        this.dataToSendOtp = formData.email;
                        this.isSuccessRegistered = true;
                    } else {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Chú ý',
                            detail: 'Tài khoản đã tồn tại',
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
