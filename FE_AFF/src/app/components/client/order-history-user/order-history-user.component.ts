import { Component, OnInit } from '@angular/core';
import { OrderHistoryService } from 'src/app/core/services/order-history.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { environment } from 'src/environments/environment';
import { OrderStatus } from 'src/app/core/enums/order-status.enum';


@Component({
  selector: 'app-order-history-user',
  templateUrl: './order-history-user.component.html',
  styleUrls: ['./order-history-user.component.css'],
})
export class OrderHistoryUserComponent implements OnInit {
  imageUrl: string = environment.baseApiImageUrl;
  orders: any[] = [];
  paginatedOrders: any[] = [];
  searchText: string = '';
  pageSize: number = 4;
  pageIndex: number = 1;
  userId: number | null = null;
  totalPages: number = 0;
  optionsStatusText: any[] = [];

  isModalVisible: boolean = false;
  selectedOrder: any = null;

  isVoucherModalVisible: boolean = false;
  selectedVoucher: any = null;
  voucherStatusText: string = '';
  totalAfterDiscount: number = 0;


  constructor(
    private orderHistoryService: OrderHistoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchUserCurrent(); // Lấy thông tin người dùng
    this.fetchOrders();

    this.optionsStatusText = [
      {
          name: this.getStatusText(OrderStatus.Pending).text,
          value: OrderStatus.Pending,
      },
      {
          name: this.getStatusText(OrderStatus.Approved).text,
          value: OrderStatus.Approved,
      },
      {
          name: this.getStatusText(OrderStatus.Inprocess).text,
          value: OrderStatus.Inprocess,
      },
      {
          name: this.getStatusText(OrderStatus.Success).text,
          value: OrderStatus.Success,
      },
      {
          name: this.getStatusText(OrderStatus.Cancelled).text,
          value: OrderStatus.Cancelled,
      },
    ];
  }

  getStatusText(statusOrder: OrderStatus): { text: string; color: string } {
    switch (statusOrder) {
      case OrderStatus.Pending:
          return { text: 'Chờ duyệt', color: 'orange' };
      case OrderStatus.Approved:
          return { text: 'Đã duyệt', color: '#ebeb26' };
      case OrderStatus.Inprocess:
          return { text: 'Chờ xử lý', color: 'purple' };
      case OrderStatus.Success:
          return { text: 'Thành công', color: 'green' };
      case OrderStatus.Cancelled:
          return { text: 'Hủy', color: 'red' };
      default:
          return { text: '', color: 'black' };
    }
  }

  // Lấy thông tin người dùng hiện tại
  fetchUserCurrent(): void {
    this.authService.fetchUserCurrent().subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.userId = response.data.id; // Lấy userId
          this.fetchOrders(); // Gọi fetchOrders sau khi có userId
        }
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      },
    });
  }

  // Lấy danh sách đơn hàng của người dùng
  fetchOrders(): void {
    if (!this.userId) return;
  
    this.orderHistoryService.getPaging({
      userId: this.userId,
      pageSize: this.pageSize, // Yêu cầu API trả về tất cả sản phẩm
      pageIndex: 1, // Lấy từ trang đầu tiên
    }).subscribe({
      next: (response: any) => {
        console.log('Dữ liệu trả về từ API:', response); // Debug dữ liệu
        if (response?.status) {
          this.orders = response.data.items.map((order: any) => ({
            ...order,
            codeProduct: order.orderTrackingNumber || 'Mã sản phẩm chưa có',
            productId: order.id || 'ID sản phẩm chưa có',
            shippingAddress: order.shippingAddress || 'Địa chỉ chưa có',
            phoneNumber: order.phoneNumber || 'Số điện thoại chưa có',
            userName: order.userName || 'Tên người nhận chưa có',

            sellingPrice: order.orderDetails?.[0]?.product?.sellingPrice || 'Giá chưa có',
            totalAmount: order.totalAmount || 'Tổng giá tiền chưa có',
            totalquantity: order.totalQuantity || 'Số lượng chưa có',
            createAt: order.createdAt || 'Ngày - tháng',
          }));
          this.updatePaginatedOrders();
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy dữ liệu đơn hàng:', err);
      },
    });
  }

  // Cập nhật danh sách sản phẩm theo trang
  updatePaginatedOrders(): void {
    const totalRecords = this.orders.length;
    this.totalPages = Math.ceil(totalRecords / this.pageSize); // Tính tổng số trang
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOrders = this.orders.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.updatePaginatedOrders();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  nextPage(): void {
    if (this.pageIndex < this.totalPages) {
      this.pageIndex++;
      this.updatePaginatedOrders();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Chuyển trang
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageIndex = page;
      this.updatePaginatedOrders();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  

  // Lọc đơn hàng theo tìm kiếm
  filteredOrders(): any[] {
    const filtered = this.orders.filter((order) =>
      order.productName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      order.codeProduct?.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    return filtered.slice(startIndex, startIndex + this.pageSize);
  }


  showOrderDetails(order: any): void {
    this.selectedOrder = {
      ...order,
      voucher: order.voucher?.code || 'Không áp dụng' // Lấy mã voucher hoặc hiển thị mặc định
    };
    this.isModalVisible = true;
  }
  
  // Hàm đóng modal
  closeModal(): void {
    this.isModalVisible = false;
    this.selectedOrder = null;
  }
  
  // Hàm xác nhận đã nhận hàng
  confirmOrder(): void {
    alert('Đã xác nhận nhận hàng!');
    this.closeModal();
  }



  showVoucherDetails(order: any): void {
    // Lấy thông tin voucher từ order
    this.selectedVoucher = {
      ...order.voucher,
      userName: order.user?.name || 'Không rõ' // Lấy tên người dùng từ order hoặc hiển thị mặc định
  };

    // Log giá trị totalAmount để kiểm tra
    console.log(`Initial Total Amount (after discount from API): ${order.totalAmount}`);

    // Kiểm tra trạng thái voucher
    if (this.selectedVoucher?.voucherStatus === 1) { // 0: Đã áp dụng
        this.voucherStatusText = 'Đã áp dụng';
        this.totalAfterDiscount = order.totalAmount > 0 ? order.totalAmount : 0; // Lấy giá trị đã giảm trực tiếp từ API
    } else {
        this.voucherStatusText = 'Không áp dụng';
        this.totalAfterDiscount = order.totalAmount; // Giữ nguyên tổng tiền
    }

    // Hiển thị popup
    this.isVoucherModalVisible = true;
}



closeVoucherModal(): void {
    this.isVoucherModalVisible = false;
    this.selectedVoucher = null;
    this.voucherStatusText = '';
    this.totalAfterDiscount = 0;
}

}