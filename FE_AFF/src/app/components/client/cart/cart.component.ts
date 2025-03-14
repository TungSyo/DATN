import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
    providers: [MessageService],
})
export class CartComponent implements OnInit {
    isAllSelected: boolean = false;
    products: any;
    cartItems: any[] = [];
    totalAmount: number = 0;

    imageUrl: string = environment.baseApiImageUrl;
    userCurrent: any = null;
    isTermsOfTrade: boolean = false;
    constructor(
        private cartService: CartService,
        private router: Router,
        private authService: AuthService,
        private messageService: MessageService
    ) {
        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
        });
    }

    ngOnInit() {
        this.cartService.cart$.subscribe((items) => {
            this.cartItems = items;
            this.calculateTotalAmount();
        });

        this.isAllSelected = this.cartItems.every((item) => item.status);
    }
    calculateTotalAmount() {
        this.totalAmount = this.cartItems
            .filter((item) => item.status) // Lọc các sản phẩm có status là true
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    toggleSelectAll(event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        this.isAllSelected = isChecked;

        // Update each item in cartItems to match the "select all" state
        this.cartItems.forEach((item) => {
            item.status = isChecked;
            this.cartService.updateItemStatus(item.productId, item.status);
        });
    }

    // Optionally, add a function to update isAllSelected based on individual item selections
    updateSelectAllStatus(): void {
        this.isAllSelected = this.cartItems.every((item) => item.status);
    }

    removeItem(productId: number) {
        this.cartService.removeFromCart(productId);
    }

    updateQuantity(productId: number, quantity: number) {
        if (quantity < 1) {
            quantity = 1;
            this.cartService.updateQuantity(productId, quantity);
        } else {
            this.cartService.updateQuantity(productId, quantity);
        }
    }

    onCheckboxChange(event: Event, productId: number) {
        const checkbox = event.target as HTMLInputElement;
        const isChecked = checkbox.checked;
        this.cartService.updateItemStatus(productId, isChecked);
    }

    clearCart() {
        this.cartService.clearCart();
    }
    onTermsOfTradeChange(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        this.isTermsOfTrade = checkbox.checked; // Lấy trạng thái của checkbox
        console.log('Checkbox state:', this.isTermsOfTrade);
    }
    handleRedirectToPayment(): void {
        // Lọc các sản phẩm đã chọn để thanh toán
        const selectedItems = this.cartItems.filter((item) => item.status);

        if (selectedItems.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Chú ý',
                detail: 'Không có sản phẩm nào được chọn để thanh toán',
            });
        } else if (this.userCurrent == null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Chú ý',
                detail: 'Vui lòng đăng nhập trước khi thanh toán',
            });
        } else {
            console.log(this.isTermsOfTrade);
            if (this.isTermsOfTrade) {
                this.router.navigate(['/payment']);
            } else {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Chú ý',
                    detail: 'Vui lòng chấp thuận điều kiện giao dịch',
                });
            }
        }
    }
}
