import { Component, OnInit } from '@angular/core';
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
    styleUrls: ['./login.component.scss'],
    providers: [MessageService],
})
export class LoginComponent implements OnInit {
    valCheck: string[] = ['rememberMe'];
    password!: string;
    loginForm: FormGroup;
    messages: any[] = [];
    isShowLoginForm: any = false;
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
    ngOnInit(): void {}

    handleShowLogin() {
        this.isShowLoginForm = true;
    }
    handleDisableLogin() {
        this.isShowLoginForm = false;
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
}
