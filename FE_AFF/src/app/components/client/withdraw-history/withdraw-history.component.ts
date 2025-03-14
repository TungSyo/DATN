import { MessageService } from 'primeng/api';
import { UserCurrent } from 'src/app/core/models/identity/user-current.interface';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductApiService } from 'src/app/core/services/product-home.service';
import { WithdrawService } from 'src/app/core/services/withdraw.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';

@Component({
    selector: 'app-withdraw-history',
    templateUrl: './withdraw-history.component.html',
    styleUrls: ['./withdraw-history.component.css'],
    providers: [MessageService],
})
export class WithdrawHistoryComponent implements OnInit {
    directAmount: number = 0; // Hoa hồng
    indirectAmount: number = 0; // Điểm thưởng
    nonIndirectAmount: number = 0; //điểm có thể rút
    withdrawableAmount: number = 0;
    listBonusPoint: any[] = [];
    pageIndex: number = 1;
    pageSize: number = 10;
    totalPage: number = 0;
    totalBonus: number = 0;
    ListStatusPayments: any[];
    selectedStatus: any = null;
    selectedDateRange: string | null = null;
    searchQuery: string = '';
    filteredTransactions: any[] = [];
    withdrawHistories: any[] = [];
    startDate: null;
    endDate: null;
    code: any;
    userCurrent: any;
    constructor(
        private router: Router,
        private userreward: ProductApiService,
        // private bonuspoint: BonusPoints
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private withdrawService: WithdrawService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        // this.fetchCommissionAndReward();

        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
        });
        this.activatedRoute.queryParams.subscribe((params) => {
            const filters: any = {};

            if (params['SearchKeyword']) {
                filters.SearchKeyword = params['SearchKeyword'];
            }
            if (params['pageIndex']) {
                this.pageIndex = +params['pageIndex'];
            } else {
                this.pageIndex = 1;
            }

            // Cập nhật các biến trong component

            // Gọi API với các bộ lọc đã được cập nhật
            // this.getListBonusPonit(this.pageIndex, filters);
        });

        this.loadWithdrawHistory();

        this.ListStatusPayments = [
            {
                name: 'Trực tuyến',
                transactionType: 'Indirect',
            },
            {
                name: 'Gián tiếp',
                transactionType: 'Direct',
            },
        ];
    }

    loadWithdrawHistory(): void {
        const today = new Date(); // Ngày hiện tại

        if (new Date(this.startDate) > new Date(this.endDate)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Chú ý',
                detail: 'Ngày bắt đầu không được lớn hơn ngày kết thúc!',
            });
            return;
        }

        if (
            new Date(this.startDate) > today ||
            new Date(this.endDate) > today
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Chú ý',
                detail: 'Ngày không được lớn hơn ngày hiện tại!',
            });
            return;
        }
        const request = {
            userBuyId: this.userCurrent?.id,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize, // Hiển thị tối đa 10 mục trên mỗi trang
            startDate: this.startDate,
            endDate: this.endDate,
            type: 2,
            code: this.code?.trim() || '',
        };

        this.withdrawService.getPaging(request).subscribe((data) => {
            if (data?.data) {
                this.withdrawHistories = data.data.items; // Danh sách thông tin trên trang hiện tại
                this.totalPage = data.data.totalPages; // Tổng số trang
                this.totalBonus = data.data.totalRecords; // Tổng số thông tin
            }
        });
    }

    getStatusName(Id: number): { text: string } {
        switch (Id) {
            case 0:
                return { text: 'Chờ duyệt' };
            case 1:
                return { text: 'Đã duyệt' };
            case 2:
                return { text: 'Chờ xử lý' };
            case 3:
                return { text: 'Thành công' };
            case 4:
                return { text: 'Hủy' };
            default:
                return { text: '' };
        }
    }

    // fetchCommissionAndReward(): void {
    //     this.userreward.getapiComission().subscribe(
    //         (response) => {
    //             if (response && response.status) {
    //                 this.directAmount =
    //                     response.data.commission.directAmount || 0;
    //                 this.indirectAmount =
    //                     response.data.commission.indirectAmount || 0;
    //                 this.nonIndirectAmount =
    //                     response.data.commission.nonIndirectAmount || 0;

    //                 this.withdrawableAmount =
    //                     this.indirectAmount - this.nonIndirectAmount;
    //             }
    //         },
    //         (error) => {
    //             console.error('Error fetching commission and reward:', error);
    //         }
    //     );
    // }

    getListBonusPonit(pageIndex: number, filters?: any): void {
        const request: any = {
            PageIndex: this.pageIndex,
            PageSize: this.pageSize,
            ...filters,
        };

        this.userreward.getListBonusPoint(request).subscribe(
            (response) => {
                this.listBonusPoint = response.data.items;
                this.totalPage = response.data.totalPages;
                this.totalBonus = response.data.totalRecords;
                window.scrollTo(0, 0);
            },
            (error) => {
                console.error('Lỗi khi lấy danh sách điểm thưởng:', error);
            }
        );
    }
    // getStatusName(Id: number): { text: string } {
    //     switch (Id) {
    //         case 0:
    //             return { text: 'thành công' };
    //         case 1:
    //             return { text: 'chờ duyệt' };
    //         case 2:
    //             return { text: 'Thất bại' };
    //         case 3:
    //             return { text: 'thành công' };
    //         case 4:
    //             return { text: 'thành công' };
    //         default:
    //             return { text: '' };
    //     }
    // }

    searchTransactions(): void {
        // Kiểm tra nếu tất cả các trường đều trống
        if (
            !this.selectedStatus &&
            !this.selectedDateRange &&
            !this.searchQuery
        ) {
            // Reset lại các tham số
            this.selectedStatus = null;
            this.selectedDateRange = null;
            this.searchQuery = '';

            // Điều hướng đến trang detail-amount (hoặc trang mặc định của bạn)
            this.router.navigate(['/detail-amount']);
        } else {
            // Chuẩn bị các bộ lọc từ người dùng
            const filters: any = {};

            if (this.selectedStatus) {
                filters.transactionType = this.selectedStatus;
            }
            if (this.selectedDateRange) {
                filters.dateRange = this.selectedDateRange;
            }
            if (this.searchQuery) {
                filters.SearchKeyword = this.searchQuery.trim();
            }

            // Cập nhật URL với các tham số tìm kiếm
            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: { ...filters, pageIndex: 1 }, // Đặt lại pageIndex về 1 khi tìm kiếm
                // queryParamsHandling: 'merge', // Giữ lại các params khác nếu có
            });

            // Gọi API tìm kiếm với các filter đã cập nhật
            this.getListBonusPonit(this.pageIndex, filters);
        }
    }
    changePage(page: number): void {
        if (page >= 1 && page <= this.totalPage) {
            this.pageIndex = page;
            this.loadWithdrawHistory();
        }
    }
    getFormattedAmount(
        amount: number | null | undefined,
        source: number
    ): { text: string; color: string } {
        if (amount === null || amount === undefined) {
            return { text: '', color: '' };
        }

        const formattedAmount = amount.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });

        if (source === 1) {
            return { text: `+ ${formattedAmount}`, color: 'green' };
        } else {
            return { text: ` ${formattedAmount}`, color: 'red' };
        }

        return { text: formattedAmount, color: '' };
    }

    getTransactionType(name: string): { text: string } {
        switch (name) {
            case 'Direct':
                return { text: 'Trực tiếp' };
            case 'Indirect':
                return { text: 'Gián tiếp' };
            default:
                return { text: '' };
        }
    }
    getSource(name: number): { text: string } {
        switch (name) {
            case 1:
                return { text: 'Nhận vào' };
            case 2:
                return { text: 'Rút tiền' };
            case 3:
                return { text: 'Mua hàng bằng gián tiếp' };
            default:
                return { text: '' };
        }
    }
}
