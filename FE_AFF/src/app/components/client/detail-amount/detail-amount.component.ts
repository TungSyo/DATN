import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductApiService } from 'src/app/core/services/product-home.service';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/identity/auth.service';
// import { BonusPoints } from 'src/app/core/services/bonusPoints.service';
import { MessageService } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-detail-amount',
  templateUrl: './detail-amount.component.html',
  styleUrl: './detail-amount.component.css'
})
export class DetailAmountComponent {

  directAmount: number = 0; // Hoa hồng
  indirectAmount: number = 0; // Điểm thưởng
  nonIndirectAmount: number = 0; //điểm có thể rút
  withdrawableAmount: number = 0;
  listBonusPoint: any [] = [];
  pageIndex : number =1;
  pageSize : number =10;
  totalPage: number =0;
  totalBonus: number =0
  ListStatusPayments : any []
  selectedStatus: any = null;
  selectedDateRange: string | null = null;
  searchQuery: string = '';
  filteredTransactions: any[] = [];
  ListOrigin : any []
  userId : number;
  FromDate :string = '';
  ToDate :string = '';
  ListStatusPayments1 : any []

  constructor(
    private router: Router,
    private userreward: ProductApiService,
    // private bonuspoint: BonusPoints
    private activatedRoute: ActivatedRoute,
    private userreward1 : AuthService,
    private messageService : MessageService,
    private cdr: ChangeDetectorRef,
    
) {}

  ngOnInit(): void {
    this.fetchCommissionAndReward();
    this.activatedRoute.queryParams.subscribe((params) => {
      const filters: any = {};
      
      if (params['TransactionType']) {
        filters.TransactionType = params['TransactionType'];
      }
      if (params['dateRange']) {
        filters.dateRange = params['dateRange'];
      }
      if (params['SearchKeyword']) {
        filters.SearchKeyword = params['SearchKeyword'];
      }
      if (params['PageIndex']) {
        this.pageIndex = +params['PageIndex']; 
      } else {
        this.pageIndex = 1; 
      }
      if (params['FromDate']) {
        filters.FromDate = params['FromDate'];
      }
      if (params['ToDate']) {
        filters.ToDate = params['ToDate'];
      }
      else {
        this.pageIndex = 1;
      }
  
      this.getListBonusPonit(this.pageIndex, filters);
    });
    this.ListStatusPayments = [
      {
        name: 'Trực tiếp',
        transactionType: "Direct",
      },
      {
        name: 'Gián tiếp',
        transactionType: "Indirect",
      },
      
     
    ];
  
    this.fetchUserCurrent()
    
  }
  
  fetchCommissionAndReward(): void {
    this.userreward.getapiComission().subscribe(
      (response) => {
        if (response && response.status) {
          this.directAmount = response.data.commission.directAmount || 0;
          this.indirectAmount = response.data.commission.indirectAmount || 0;
          this.nonIndirectAmount = response.data.commission.nonIndirectAmount || 0;

          this.withdrawableAmount = this.indirectAmount - this.nonIndirectAmount;
        }
      },
      (error) => {
        console.error('Error fetching commission and reward:', error);
      }
    );
  }

  async fetchUserCurrent(): Promise<void> {
    try {
      const response: any = await this.userreward1.fetchUserCurrent().toPromise();
      if (response?.status) {
        this.userId = response.data.id;
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  }
  async getListBonusPonit(pageIndex: number, filters?: any): Promise<void> {
    if (!this.userId) {
      await this.fetchUserCurrent(); 
    }
    const request: any = {
      PageIndex: this.pageIndex,
      PageSize: this.pageSize,
      UserId: this.userId,
      ...filters,
    };
    
    
    this.userreward.getListBonusPoint(request).subscribe(
      (response) => {
        this.listBonusPoint = response.data.items;
        this.totalPage = response.data.totalPages
        this.totalBonus = response.data.totalRecords
        window.scrollTo(0,0);
        this.ListStatusPayments1 = [...this.listBonusPoint];
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách điểm thưởng:', error);
      }
    );
  }
  getStatusName(Id : number): {text:string;}{
    switch(Id){
      case 0 :
        return {text: 'Chờ duyệt'};
      case 1 :
        return {text: 'Đã duyệt'};
      case 2 :
        return {text: 'Chờ xử lý'};
      case 3 :
        return {text: 'Thành công'};
      case 4 :
        return {text: 'Hủy'};
      default:
        return { text: ''}
    }
  }
  getListOrign (Id : number): {text:string;}{
    switch(Id){
      case 1 :
        return {text: 'Tiền thưởng hoa hồng'};
      case 2 :
        return {text: 'Yêu cầu rút tiền'};
      case 3 :
        return {text: 'Mua hàng bằng điểm'};
      case 4 :
        return {text: 'Voucher'};
     
      default:
        return { text: ''}
    }
  }
  getTransactionType (name : string): {text:string;}{
    switch(name){
      case "Direct" :
        return {text: 'Trực tiếp'};
      case "Indirect" :
        return {text: 'Gián tiếp'};
     
     
      default:
        return { text: ''}
    }
  }

  searchTransactions(): void {
    // Kiểm tra nếu tất cả các trường đều trống
    if (!this.selectedStatus && !this.selectedDateRange && !this.searchQuery && !this.FromDate && !this.ToDate) {
      this.selectedStatus = null;
      this.selectedDateRange = null;
      this.searchQuery = '';
      this.FromDate = ''; 
      this.ToDate = ''
      
      this.router.navigate(['/detail-amount']);
    } else {
      const filters: any = {};
  
      if (this.selectedStatus) {
        filters.TransactionType = this.selectedStatus;
      }
       if (this.selectedDateRange) {
        filters.dateRange = this.selectedDateRange;
      }
      if (this.searchQuery) {
        filters.SearchKeyword = this.searchQuery.trim();
      }
      if (this.FromDate) {
        filters.FromDate = this.FromDate; 
      }
      if (this.ToDate) {
        filters.ToDate = this.ToDate;
      }
      if (
        this.FromDate &&
        this.ToDate &&
        new Date(this.FromDate) > new Date(this.ToDate)
    ) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Cảnh báo',
            detail : ' Ngày kết thúc phải lớn hơn ngày bắt đầu'

        })
        return;
    }
  
      // Cập nhật URL với các tham số tìm kiếm
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { ...filters, pageIndex: 1 }, 
        queryParamsHandling: '', 
      });
  
      // Gọi API tìm kiếm với các filter đã cập nhật
      this.getListBonusPonit(this.pageIndex, filters);
    }
  }
  
 async changePage(page: number): Promise<void> {
    if (page >= 1 && page <= this.totalPage) {
      this.pageIndex = page;
  
      // Tạo bộ lọc từ các tham số có trong URL
      const filters: any = {};
  
      if (this.selectedStatus) {
        filters.TransactionType = this.selectedStatus;
      }
      if (this.selectedDateRange) {
        filters.dateRange = this.selectedDateRange;
      }
      if (this.searchQuery) {
        filters.SearchKeyword = this.searchQuery;
      }
      if (this.FromDate) {
        filters.FromDate = this.FromDate;
      }
      if (this.ToDate) {
        filters.ToDate = this.ToDate;
      }
  
        await this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { ...filters }, 
      
      });
  
      await this.getListBonusPonit(this.pageIndex, filters);
    }
  }
 
 
  getFormattedAmount(amount: number | null | undefined, source: number): { text: string; color: string } {
    if (amount === null || amount === undefined) {
      return { text: '', color: '' };
    }
  
    const formattedAmount = amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  
    if (source === 1) {
      return { text: `+ ${formattedAmount}`, color: 'green' };
    } else {
      return { text: ` ${formattedAmount}`, color: 'red' };
    }
  
    return { text: formattedAmount, color: '' };
  }
  
  
 
  
  
  

}
