import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderStatus } from 'src/app/core/enums/order-status.enum';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { WithdrawService } from 'src/app/core/services/withdraw.service';

@Component({
    selector: 'app-withdraw',
    templateUrl: './withdraw.component.html',
    styleUrls: ['./withdraw.component.css'],
})
export class WithdrawComponent implements OnInit {
    // OrderStatus.Pending
    currentOrderStatus: string = 'pending';
    withdrawForm: FormGroup;
    isSubmitting: boolean = false;
    isSubmittingText: string = '';
    userCurrent: any;
    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private withdrawService: WithdrawService
    ) {
        this.withdrawForm = this.formBuilder.group({
            // phoneNumber: [null, [Validators.required]],
            commission: [null, [Validators.required]],
            // type: [null, [Validators.required]],
            // status: [null, [Validators.required]],
            // paymentType: [null, [Validators.required]],
        });
        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
        });
    }

    ngOnInit() {}

    onSubmit() {
        if (this.withdrawForm.valid) {
            if (this.isSubmitting) {
                return;
            }
            this.isSubmitting = true;
            this.isSubmittingText = 'Đang xử lí ...';

            const formData = {
                userBuyId: this.userCurrent?.id,
                commission: this.withdrawForm.value.commission,
                type: 2,
                status: 1,
                paymentType: this.currentOrderStatus,
            };
            this.withdrawService.create(formData).subscribe((items) => {
                console.log(items);
            });
            console.log(formData);
        }
    }
}
