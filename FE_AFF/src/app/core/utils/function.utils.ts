import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class FunctionService {
    //Kiểm tra ngày sinh lớn hơn ngày hiện tại

    handleFocusPrice(event: FocusEvent) {
        const input = event.target as HTMLInputElement;
        input.select();
    }
}
