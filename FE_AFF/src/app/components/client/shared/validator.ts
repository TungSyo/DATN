import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl) => {
        const value = control.value || '';
        const isWhitespace = value.trim().length === 0; 
        const hasLeadingWhitespace = value.startsWith(' '); 
        const hasTrailingWhitespace = value.endsWith(' '); 
        const hasMultipleSpacesInMiddle = /\s{2,}/.test(value); 

        const isValid = !isWhitespace && !hasLeadingWhitespace && !hasTrailingWhitespace && !hasMultipleSpacesInMiddle;

        return isValid ? null : { whitespace: true };
    };
}

export function emailValidator(
    control: AbstractControl
): ValidationErrors | null {
    const email = control.value;

    // Regular expression để kiểm tra định dạng email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email && !emailPattern.test(email)) {
        return { invalidEmail: true };
    }

    return null;
}

export function referralCodeNotMatchingPhoneNumberValidator(): ValidationErrors | null {
    return (control: AbstractControl) => {
        const referralCode = control.value;
        const phoneNumber = control.parent?.get('phoneNumber')?.value;

        if (referralCode && referralCode === phoneNumber) {
            return { referralCodeMatchesPhoneNumber: true };
        }
        return null;
    };
}
