import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/core/utils/validation.utils';

import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { Page } from 'src/app/core/enums/page.enum';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  valCheck: string[] = ['rememberMe'];
  messages: any[] = [];
  password!: string;
  changePasswordForm: FormGroup;
  otpSent: boolean = false;
  showPassword: boolean = false;
  showPasswordConfim: boolean = false;
  errorMessages: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    public layoutService: LayoutService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required, this.validationService.noWhitespaceValidator]],
      newPassword: [null, [Validators.required, this.validationService.noWhitespaceValidator]],
    });

    this.changePasswordForm.get('oldPassword')?.valueChanges.subscribe(() => {
      this.errorMessages = false;
    });
    this.changePasswordForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.errorMessages = false;
    });
  }
  
  
  
  

  // passwordMatchValidator(form: FormGroup) {
  //   const newPassword = form.get('newPassword')?.value;
  //   const confirmPassword = form.get('confirmPassword')?.value;

  //   return newPassword === confirmPassword
  //     ? null
  //     : { passwordMismatch: true };
  // }
  // onSubmit() {
  //   const formData = this.changePasswordForm.value;
  
  //   if (formData.oldPassword === formData.newPassword) {
  //     this.errorMessages = true;
  //     this.messages = [{ severity: 'error', detail: 'Mật khẩu mới không được trùng với mật khẩu cũ!' }];
  //     return;
  //   }
  
  //   this.userService.ChangePassword(formData).subscribe({
  //     next: (response) => {
  //       this.changePasswordForm.reset();
  //       this.messages = [{ severity: 'success', detail: 'Mật khẩu đã được đổi thành công!' }];
  //       setTimeout(() => this.handleLogout(), 2000);
  //     },
  //     error: () => {
  //       this.messages = [{ severity: 'error', detail: 'Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.' }];
  //     }
  //   });
  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng nhập mật khẩu cũ và mới hợp lệ !',
        life: 3000
      });
      return;
    }
  
    const formData = this.changePasswordForm.value;
  
    // Kiểm tra mật khẩu cũ có chứa khoảng trắng không
    if (!formData.oldPassword.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu cũ không được chứa khoảng trắng!',
        life: 3000
      });
      return;
    }
  
    if (formData.oldPassword === formData.newPassword) {
      this.errorMessages = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu mới không được trùng với mật khẩu cũ!',
        life: 3000
      });
      return;
    }
  
    this.userService.ChangePassword(formData).subscribe({
      next: () => {
        this.changePasswordForm.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Mật khẩu đã được đổi thành công!',
          life: 2000
        });
        setTimeout(() => this.handleLogout(), 2000);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.',
          life: 3000
        });
      }
    });
  }
  
  
  handleLogout() {
    this.authService.logout().subscribe(
      (res) => {
        if (res.status) {
          this.authService.setUserCurrent(null);
          this.authService.setAuthTokenLocalStorage(null);
          this.router.navigate([Page.Home]);
          this.messageService.add({
            severity: 'warn',
            summary: 'Thông báo',
            detail: 'Mật khẩu đã thay đổi. Hãy đăng nhập lại',
            life: 3000,
          });
        }
      },
      (exception) => {
        this.messageService.add({
          severity: 'warning',
          summary: 'Cảnh báo',
          detail: 'Lỗi hệ thống',
        });
      }
    );
  }

  navigateToSetPassword() {
    this.router.navigate(['']);
  }
}
