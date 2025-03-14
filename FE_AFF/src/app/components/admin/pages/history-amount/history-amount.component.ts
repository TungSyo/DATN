import { Component, OnInit } from '@angular/core';
import { ProductApiService } from 'src/app/core/services/product-home.service';

@Component({
  selector: 'app-history-amount',
  templateUrl: './history-amount.component.html',
  styleUrls: ['./history-amount.component.css']
})
export class HistoryAmountComponent implements OnInit {
  bonusPoints: any[] = [];
  filteredBonusPoints: any[] = [];
  filteredUserNames: string[] = [];
  loading: boolean = true;
  totalRecords: number = 0;

  startDate: Date | null = null;
  endDate: Date | null = null;

  searchTransactionType: string = '';
  searchUserName: string = '';
  searchDate: Date | null = null;

  pageIndex: number = 0; // Bắt đầu từ 0 để phù hợp với p-paginator
  pageSize: number = 10; // Số bản ghi mỗi trang
  totalPages: number = 0; // Tổng số trang

  constructor(private productApiService: ProductApiService) {}

  ngOnInit(): void {
    this.getCommissionHistory();
  }

  getCommissionHistory(): void {
    // this.loading = true;

    const requestParams = {
      pageIndex: this.pageIndex + 1, // API sử dụng pageIndex bắt đầu từ 1
      pageSize: this.pageSize,
      transactionType: this.searchTransactionType,
      userName: this.searchUserName,
      date: this.searchDate ? this.searchDate.toISOString() : null,
    };

    this.productApiService.getListBonusPoint(requestParams).subscribe({
      next: (response) => {
        if (response?.status) {
          this.bonusPoints = response.data.items;
          this.filteredBonusPoints = [...this.bonusPoints];
          this.totalRecords = response.data.totalRecords;

          // Tính tổng số trang
          this.totalPages = this.totalRecords % this.pageSize === 0
            ? this.totalRecords / this.pageSize
            : Math.floor(this.totalRecords / this.pageSize) + 1;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching commission history:', err);
        this.loading = false;
      }
    });
  }

  filterData(): void {
    this.pageIndex = 0; // Reset về trang đầu tiên khi tìm kiếm

    // Kiểm tra nếu "Từ ngày" lớn hơn "Đến ngày"
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
        console.error('Ngày bắt đầu không được lớn hơn ngày kết thúc');
        return; // Dừng nếu điều kiện không hợp lệ
    }

    // Bắt đầu với danh sách gốc
    this.filteredBonusPoints = [...this.bonusPoints];

    // Lọc theo tên người dùng nếu có
    if (this.searchUserName.trim()) {
        this.filteredBonusPoints = this.filteredBonusPoints.filter(item =>
            item.userName.toLowerCase().includes(this.searchUserName.toLowerCase())
        );
    }

    // Lọc theo loại giao dịch nếu có
    if (this.searchTransactionType.trim()) {
        this.filteredBonusPoints = this.filteredBonusPoints.filter(item =>
            this.getTransactionTypeName(item.transactionType)
                .toLowerCase()
                .includes(this.searchTransactionType.toLowerCase())
        );
    }

    // Lọc theo khoảng ngày nếu có
    if (this.startDate && this.endDate) {
        const start = new Date(this.startDate).setHours(0, 0, 0, 0);
        const end = new Date(this.endDate).setHours(23, 59, 59, 999);

        this.filteredBonusPoints = this.filteredBonusPoints.filter(item => {
            const itemDate = new Date(item.transactionDate).getTime();
            return itemDate >= start && itemDate <= end;
        });
    }

    // Cập nhật tổng số bản ghi và tổng số trang
    this.totalRecords = this.filteredBonusPoints.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  resetDates(): void {
    this.startDate = null;
    this.endDate = null;
    this.filterData(); // Lọc lại dữ liệu sau khi xóa
}

  


  changePage(event: any): void {
    this.pageIndex = event.page;
    this.pageSize = event.rows;
    this.getCommissionHistory();
  }

  getTransactionTypeName(name: string): string {
    switch (name) {
      case 'Direct':
        return 'Trực tiếp';
      case 'Indirect':
        return 'Gián tiếp';
      default:
        return 'Không xác định';
    }
  }

  getStatusName(status: number | null): string {
    switch (status) {
      case 0:
        return 'Chờ xử lý';
      case 1:
        return 'Hoàn thành';
      case null:
        return 'Không xác định';
      default:
        return '';
    }
  }

  getSourceName(source: number): string {
    switch (source) {
      case 1:
        return 'Tiền thưởng hoa hồng';
      case 2:
        return 'Yêu cầu rút tiền';
      case 3:
        return 'Mua hàng bằng điểm';
      case 4:
        return 'Voucher';
      default:
        return 'Không xác định';
    }
  }


  getFormattedAmount(amount: number | null | undefined, source: number): { text: string; color: string } {
    if (amount === null || amount === undefined) {
      return { text: '', color: '' };
    }
  
    const formattedAmount = amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  
    if (source === 1) {
      return { text: `+ ${formattedAmount}`, color: 'green' };
    } else if (source === 2) {
      return { text: ` ${formattedAmount}`, color: 'red' };
    }
  
    return { text: formattedAmount, color: '' };
  }
}
