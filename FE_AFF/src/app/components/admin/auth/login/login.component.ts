import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import roleConstant from 'src/app/core/constants/role.constant';
import { Page } from 'src/app/core/enums/page.enum';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { ValidationService } from 'src/app/core/utils/validation.utils';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
    styleUrl: './login.component.scss',
    providers: [MessageService],
})
export class LoginComponent {
    valCheck: string[] = ['rememberMe'];

    password!: string;
    loginForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private validationService: ValidationService,
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {
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
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const formData = {
                email: this.loginForm.value.email,
                password: this.loginForm.value.password,
                rememberMe: this.loginForm.value.rememberMe,
            };
            this.authService.login(formData).subscribe((res) => {
                if (res.status == true) {
                    this.authService.setAuthTokenLocalStorage(res.data);
                    this.authService.fetchUserCurrent().subscribe((data) => {
                        this.authService.setUserCurrent(data.data);
                        if (
                            this.authService.hasRole(roleConstant.admin) ||
                            this.authService.hasRole(roleConstant.master) ||
                            this.authService.hasRole(roleConstant.employee)
                        ) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Thành công',
                                detail: 'Đăng nhập thành công',
                            });
                            this.router.navigate([Page.Dashboard]);
                        } else {
                            this.authService.setAuthTokenLocalStorage(null);
                            this.authService.setUserCurrent(null);
                            this.messageService.add({
                                severity: 'warning',
                                summary: 'Cảnh báo',
                                detail: 'Bạn không có quyền',
                            });
                        }
                    });
                    this.router.navigate([Page.AdminLogin]);
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
}
