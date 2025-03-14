// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-otp',
//   templateUrl: './otp.component.html',
//   styleUrls: ['./otp.component.css']
// })
// export class OtpComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }

import {
    Component,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/identity/auth.service';
// import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'app-otp',
    templateUrl: './otp.component.html',
    styleUrls: ['./otp.component.css'],
})
export class OtpComponent implements OnInit {
    @Input() dataFromParent: any;
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

    constructor(private authService: AuthService, private router: Router) {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as { username: string };
        if (state && state.username) {
            this.username = state.username;
            localStorage.setItem('username', this.username);
        } else {
            this.username = localStorage.getItem('username') || '';
        }
    }

    ngOnInit(): void {
        // if (!this.username) {
        //     this.errorMessage =
        //         'Không tìm thấy tên người dùng, vui lòng đăng nhập lại.';
        //     this.router.navigate(['/layout-login/login']);
        // }
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
            .verifyOtp({ email: this.dataFromParent, otp: otp })
            .subscribe(
                (response) => {
                    this.isVerifyOtpIn = false;
                    if (response.data) {
                        // this.errorMessage = '';
                        // this.authService.saveUserInfo(response.data); // Save the user info
                        // localStorage.setItem('token', response.data.token);
                        // localStorage.removeItem('otpRequested');
                        // // alert('Đăng nhập thành công!');
                        this.messages = [
                            {
                                severity: 'success',
                                summary: 'Thành công',
                                detail: 'Đăng ký thành công!',
                                life: 3000,
                            },
                        ];
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                        this.router.navigate(['/']);
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
