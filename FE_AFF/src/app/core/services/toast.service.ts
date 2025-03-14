// toast.service.ts
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor(private messageService: MessageService) {}

    showSuccess(summary: string, detail: string) {
        console.log(1);

        this.messageService.add({
            severity: 'success',
            summary: summary,
            detail: detail,
        });
    }

    showError(summary: string, detail: string) {
        this.messageService.add({
            severity: 'error',
            summary: summary,
            detail: detail,
        });
    }

    // Thêm các phương thức khác cho các loại thông báo khác nhau nếu cần
}
