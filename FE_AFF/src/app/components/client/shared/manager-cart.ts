export class ManagerCart {
    // Hàm lấy giỏ hàng từ localStorage
    private getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : []; // Nếu không có giỏ hàng, trả về mảng rỗng
    }

    // Hàm thêm sản phẩm vào giỏ hàng
    public addProductToCart(item: any) {
        const cart = this.getCart(); // Lấy giỏ hàng hiện tại
        const existingItemIndex = cart.findIndex((i: any) => i.id === item.id); // Kiểm tra sản phẩm đã có trong giỏ chưa

        if (existingItemIndex !== -1) {
            // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng
            cart[existingItemIndex].quantity += item.quantity;
        } else {
            // Nếu sản phẩm chưa có, thêm sản phẩm mới vào giỏ
            cart.push(item);
        }

        // Lưu giỏ hàng đã cập nhật vào localStorage
        window.localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Hàm xóa sản phẩm khỏi giỏ
    public removeProductFromCart(itemId: any) {
        const cart = this.getCart();
        const updatedCart = cart.filter((item: any) => item.id !== itemId); // Lọc ra sản phẩm không có id tương ứng
        window.localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    // Hàm lấy tất cả sản phẩm trong giỏ
    public getAllItems() {
        return this.getCart();
    }




}
