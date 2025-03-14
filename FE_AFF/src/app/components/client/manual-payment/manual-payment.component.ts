import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';
import { PaymentQrComponent } from '../shared/modules/payment-qr/payment-qr.component';

@Component({
    selector: 'app-manual-payment',
    templateUrl: './manual-payment.component.html',
    styleUrls: ['./manual-payment.component.css'],
})
export class ManualPaymentComponent implements OnInit {
    manualPayment: any = {};
    leftTime: any;
    order: any;
    public userCurrent: any = null;
    isExpired: boolean = false;

    @ViewChild(PaymentQrComponent) paymentQrComponent!: PaymentQrComponent;
    constructor(
        // public authService: AuthService,
        private orderService: OrderService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe((params) => {
            const orderId = params.get('id');
            if (orderId) {
                this.orderService
                    .getById({ id: orderId })
                    .subscribe((result) => {
                        this.order = result.data;
                        this.manualPayment.bankCode =
                            result.data?.paymentAccount?.bankCode;
                        this.manualPayment.bankAccount =
                            result.data?.paymentAccount?.accountNumber;
                        this.manualPayment.amount = result.data?.totalAmount;
                        this.manualPayment.transferContent =
                            result.data?.orderTrackingNumber;
                        this.manualPayment.accountName =
                            result.data.paymentAccount?.accountName;
                        this.isExpired = false;
                    });
            }
        });
    }
}
