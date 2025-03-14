import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private cart: any[] = [];
    private cartSubject = new BehaviorSubject<any[]>([]);

    cart$ = this.cartSubject.asObservable();

    constructor() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.cartSubject.next(this.cart);
        }
    }

    // Thêm sản phẩm vào giỏ
    addToCart(item: any) {
        const item1 = {
            ...item,
            status: false,
        };
        const index = this.cart.findIndex(
            (i) => i.productId === item1.productId
        );
        if (index !== -1) {
            this.cart[index].quantity += item1.quantity;
        } else {
            this.cart.push(item1);
        }

        this.updateCart();
    }

    // Lấy tất cả sản phẩm trong giỏ
    getcart(): any[] {
        return this.cart;
    }

    // Cập nhật trạng thái chọn sản phẩm
    updateItemStatus(productId: number, status: boolean) {
        const index = this.cart.findIndex(
            (item) => item.productId === productId
        );
        if (index !== -1) {
            this.cart[index].status = status;
            this.updateCart();
        }
    }

    // Xóa sản phẩm khỏi giỏ
    removeFromCart(productId: number) {
        this.cart = this.cart.filter((item) => item.productId !== productId);
        this.updateCart();
    }

    // Cập nhật số lượng sản phẩm trong giỏ
    updateQuantity(productId: number, quantity: number) {
        const index = this.cart.findIndex(
            (item) => item.productId === productId
        );
        if (index !== -1) {
            this.cart[index].quantity = quantity;
            this.updateCart();
        }
    }

    // Xóa tất cả sản phẩm trong giỏ
    clearCart() {
        this.cart = this.cart.filter((item) => !item.status);
        this.updateCart();
    }

    // Lấy các sản phẩm đã chọn để thanh toán
    getSelectedItemsForCheckout() {
        return this.cart.filter((item) => item.status);
    }

    // Cập nhật trạng thái của giỏ hàng
    private updateCart() {
        this.cartSubject.next([...this.cart]);
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
}
