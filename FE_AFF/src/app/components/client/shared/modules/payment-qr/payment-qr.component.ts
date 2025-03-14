import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-payment-qr',
    templateUrl: './payment-qr.component.html',
    styleUrls: ['./payment-qr.component.css'],
})
export class PaymentQrComponent implements OnInit {
    @Input() bank: string = 'mb';
    @Input() bankAccount: string = '1023163599';
    @Input() amount!: string;
    @Input() transferContent!: string;
    @Input() accountName!: string;

    public qrImageUrl!: string;

    ngOnInit() {
        this.qrImageUrl = `https://img.vietqr.io/image/${this.bank}-${
            this.bankAccount
        }-print.jpg?amount=${this.amount}&addInfo=${encodeURIComponent(
            this.transferContent
        )}&accountName=${encodeURIComponent(this.accountName)}`;
    }

    updateQrImageUrl(
        bank: any,
        bankAccount: any,
        amount: any,
        transferContent: any,
        accountName: any
    ) {
        this.qrImageUrl = `https://img.vietqr.io/image/vcb-123456789-print.jpg?amount=1000000&addInfo=Thanh%20toan%20hoa%20don&accountName=Nguyen%20Van%20A
`;
    }
}
