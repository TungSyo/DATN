import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class ValidationService {
    //Kiểm tra ngày sinh lớn hơn ngày hiện tại

    // Validate Email
    validateEmail(control: any) {
        const emailRegex =
            /^(?=.*[a-zA-Z])[\w.-]*[a-zA-Z][\w.-]*@[a-zA-Z\d-]+(\.[a-zA-Z]{2,4})+$/;
        if (control.value && !emailRegex.test(control.value)) {
            return { invalidEmail: true };
        }
        return null;
    }

    dateOfBirthValidator(control: any) {
        const selectedDate = new Date(control.value);
        const currentDate = new Date();
        if (selectedDate > currentDate) {
            return { invalidDateOfBirth: true };
        }
        return null;
    }

    //Kiểm tra ngày hết hạn phải lớn hơn ngày hiện tại
    dateOfDueDateValidator(control: any) {
        const dueDate = new Date(control.value);
        const currentDate = new Date();
        const tenYearsFromNow = new Date(
            currentDate.getFullYear() + 10,
            currentDate.getMonth(),
            currentDate.getDate()
        );

        // Kiểm tra nếu ngày hết hạn trước ngày hiện tại
        if (dueDate < currentDate) {
            return { invalidDateOfDueDate: true };
        }

        // Kiểm tra nếu ngày hết hạn quá xa trong tương lai (hơn 10 năm từ hiện tại)
        if (dueDate > tenYearsFromNow) {
            return { invalidDateOfDueDate: true };
        }

        return null;
    }

    //kiểm tra xem giá trị của trường có chứa khoảng trắng hay không
    noWhitespaceValidator(control: any) {
        const value = control.value || '';
        const hasWhitespace = /\s/.test(value);
        return hasWhitespace ? { whitespace: true } : null;
    }

    //Ngăn chặn nhập kí tự không phải số
    onKeyPress(event: KeyboardEvent) {
        const inputChar = event.key;
        if (!this.isNumberOrCommaKey(inputChar)) {
            event.preventDefault();
        }
    }

    isNumberOrCommaKey(inputChar: string): boolean {
        // Allow digits and comma
        return /^[0-9,]$/.test(inputChar);
    }

    // Kiểm tra xem ký tự (char) có phải là số không.
    isNumberKey(char: string) {
        return /^\d+$/.test(char);
    }

    // Validator để kiểm tra kích thước của tệp tin
    fileSizeValidator(maxSize: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (!control.value) {
                return null;
            }
            const file: File = control.value;
            if (file.size > maxSize) {
                return { fileSizeExceeded: true };
            }
            return null;
        };
    }

    
    // Hàm này kiểm tra tính hợp lệ của tên (control.value):
    // Loại bỏ các khoảng trắng ở đầu và cuối chuỗi.
    validateName(control: AbstractControl): { [key: string]: any } | null {
        const value = control.value as string;
        let startIndex = 0;
        let endIndex = value.length - 1;

        while (
            startIndex < value.length &&
            (value[startIndex] === ' ' || value[startIndex] === '')
        ) {
            startIndex++;
        }

        while (
            endIndex >= 0 &&
            (value[endIndex] === ' ' || value[endIndex] === '')
        ) {
            endIndex--;
        }

        if (startIndex > endIndex) {
            return { invalidName: true };
        }

        const trimmedLength = endIndex - startIndex + 1;
        if (trimmedLength < 6 || trimmedLength > 101) {
            return { invalidLength: true };
        }

        return null;
    }
}
