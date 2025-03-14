import { Component, OnInit } from '@angular/core';
import { CommistionAccount } from 'src/app/core/services/comistion-account.service';
import { ProductApiService } from 'src/app/core/services/product-home.service';

@Component({
  selector: 'app-list-commissions-account',
  templateUrl: './list-commissions-account.component.html',
  styleUrl: './list-commissions-account.component.scss'
})
export class ListCommissionsAccountComponent implements OnInit {
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

  constructor(private productApiService: ProductApiService,
    private commistionService: CommistionAccount
  ) {}

  ngOnInit(): void {
    this.getCommissionHistory();
  }

  getCommissionHistory(): void {
    // this.loading = true;

    const requestParams = {
      pageIndex: this.pageIndex + 1, 
      pageSize: this.pageSize,
      KeyWord: this.searchUserName,
    };

    this.commistionService.getPaging(requestParams).subscribe({
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
    this.pageIndex = 0;
    if (this.searchUserName && this.searchUserName.trim()) {
      this.filteredBonusPoints = this.filteredBonusPoints.filter(item =>
        item.userName && item.userName.toLowerCase().includes(this.searchUserName.toLowerCase())
      );
    } else {
      this.filteredBonusPoints = [...this.bonusPoints];
    }
  
    this.getCommissionHistory();
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
