import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionsFilterOrderHistory } from 'src/app/core/models/option-filter-order';
import { OrderHistoryService } from 'src/app/core/services/order-history.service';
import { OrderStatus } from 'src/app/core/enums/order-status.enum';
@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrl: './order-history.component.scss',
})
export class OrderHistoryComponent implements OnInit {
    items: any[] = [];
    orders: any[] = [];
    messages!: any[];
    keyword: string;
    totalRecords: number = 0;
    PageSize: number = 10;
    PageIndex: number = 1;
    ordersHistory: any[] = [];
    currentPageReport: string = '';
    deadlineRange: Date[] = [];
    formatdate: string = 'dd/mm/yy';
    startDate: string | undefined;
    endDate: string | undefined;
    orderStatus: OrderStatus;
    selectedOrderStatus: OrderStatus;
    optionsStatusText: any[] = [];
    optionsFilterCommodities: OptionsFilterOrderHistory =
        new OptionsFilterOrderHistory();

    constructor(private orderHistoryService: OrderHistoryService) {}
    ngOnInit() {
        this.items = [
            { icon: 'pi pi-home', route: '/' },
            { label: 'Lịch sử giao dịch' },
        ];
        this.getPaging();
        this.optionsStatusText = [
            {
                name: this.getStatusText(OrderStatus.Pending),
                value: OrderStatus.Pending,
            },
            {
                name: this.getStatusText(OrderStatus.Approved),
                value: OrderStatus.Approved,
            },
            {
                name: this.getStatusText(OrderStatus.Inprocess),
                value: OrderStatus.Inprocess,
            },
            {
                name: this.getStatusText(OrderStatus.Success),
                value: OrderStatus.Success,
            },
            {
                name: this.getStatusText(OrderStatus.Cancelled),
                value: OrderStatus.Cancelled,
            },
        ];
    }
    getStatusText(statusOrder: number): string {
        switch (+statusOrder) {
            case OrderStatus.Pending:
                return 'Chờ duyệt';
            case OrderStatus.Approved:
                return 'Đã duyệt';
            case OrderStatus.Inprocess:
                return 'Chờ xử lý';
            case OrderStatus.Success:
                return 'Thành công';
            case OrderStatus.Cancelled:
                return 'Hủy Bỏ';
            default:
                return '';
        }
    }
    getPaging() {
        let request = {
            PageIndex: this.PageIndex,
            PageSize: this.PageSize,
        };
        this.orderHistoryService.getPagingvAdmin(request).subscribe((res) => {
            this.ordersHistory = res.data.items;
            this.totalRecords = res.data.totalRecords;
            this.PageIndex = res.data.pageIndex;
            this.PageSize = res.data.pageSize;
            this.updateCurrentPageReport();
        });
    }
    clickButtonFilter() {
        this.Filters();
    }
    onInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const trimmedValue = inputElement.value.trim(); // Cắt ký tự khoảng trắng ở hai đầu chuỗi
        this.optionsFilterCommodities.OrderTrackingNumber = trimmedValue;
    }
    onPageChange(event: any): void {
        this.PageIndex = event.page + 1;
        this.PageSize = event.rows;
        this.Filters();
    }
    Filters(): void {
        //debugger
        const request = {
            PageIndex: this.PageIndex,
            PageSize: this.PageSize,
            FromDate: this.startDate != null ? this.startDate : undefined,
            ToDate: this.endDate != null ? this.endDate : undefined,
            OrderStatus: this.orderStatus,
            OrderTrackingNumber:
                this.keyword != null && this.keyword != ''
                    ? this.keyword
                    : undefined,
        };
        this.orderHistoryService.getPagingvAdmin(request).subscribe((res) => {
            console.log('res', res);
            this.ordersHistory = res.data.items;
            this.totalRecords = res.data.totalRecords;
            this.PageIndex = res.data.pageIndex;
            this.PageSize = res.data.pageSize;
            this.updateCurrentPageReport();
        });
    }
    goToPreviousPage(): void {
        if (this.PageIndex > 1) {
            this.PageIndex--;
        }
    }

    goToNextPage(): void {
        const lastPage = Math.ceil(this.totalRecords / this.PageSize);
        if (this.PageIndex < lastPage) {
            this.PageIndex++;
        }
    }

    updateCurrentPageReport(): void {
        const startRecord = (this.PageIndex - 1) * this.PageSize + 1;
        const endRecord = Math.min(
            this.PageIndex * this.PageSize,
            this.totalRecords
        );
        this.currentPageReport = `<strong>${startRecord}</strong> - <strong>${endRecord}</strong> trong <strong>${this.totalRecords}</strong> bản ghi`;
    }
    blurDateRange($event: Event) {
        if (this.deadlineRange && this.deadlineRange.length === 2) {
            const [startDate, endDate] = this.deadlineRange;
            if (startDate) {
                startDate.setHours(startDate.getHours() + 7);
                this.startDate = startDate.toISOString().substring(0, 10);
            }
            if (endDate) {
                endDate.setHours(endDate.getHours() + 7);
                this.endDate = endDate.toISOString().substring(0, 10);
            }
        } else {
            this.startDate = undefined;
            this.endDate = undefined;
        }
    }
    onFromOrderStausChange() {
        console.log('this.orderstatus', this.orderStatus);
        // this.Filters();
    }
}
