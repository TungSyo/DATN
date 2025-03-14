import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from 'src/app/core/services/order.service';
import { OrderStatus } from 'src/app/core/enums/order-status.enum';
import { Statusdeal } from 'src/app/core/enums/deal-status.enum';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
import { MessageService, MenuItem } from 'primeng/api';
import { NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
@Component({
    selector: 'app-show-payments',
    templateUrl: './show-payments.component.html',
    styleUrl: './show-payments.component.scss',
    providers: [MessageService],
})
export class ShowPaymentsComponent {
    orderList: any[] = [];
    pageIndex: number = 1;
    pageSize: number = 10;
    totalItems: number = 0;
    // pageSize: number[] = [5, 10, 20, 50];
    selectedOrderId: number | null = null;
    optionFilterOrder: any = null;
    orderGetID: any = {};
    showDialogs: boolean = false;
    imageUrl: string = environment.baseApiImageUrl;
    deadlineRange: Date[] = [];
    selectedBranchId: any;
    selectedStatusId: any;

    statusFormOrderDetail: boolean = false;

    order: any;
    statusOrder: OrderStatus;
    statusDeal: Statusdeal;
    currentPageReport: string = '';
    optionsStatus: any[] = [];
    optionsStatusText: any[] = [];
    date: Date | null = null;
    date1: Date | null = null;
    private isPageSizeChanging = false;
    visible: boolean = false;
    selectAll: boolean = false;
    orders: any[] = [];
    items: MenuItem[] | undefined;
    isDisabled: boolean = false;
    showDialog() {
        this.visible = true;
    }
    isStatusNotSelected: boolean = false;
    statusFilter: any;
    optionsStatusTextTest: any;
    isnote: boolean = false;
    originalStatusId: number;
    isValidStatusSelected: boolean = false;
    issubmit: boolean = false;
    constructor(
        private orderService: OrderService,
        private messageService: MessageService,
        private zone: NgZone,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.items = [
            { label: 'Đơn hàng' },
            { label: 'Danh sách đơn hàng' },

            // { label: 'Danh sách đơn hàng', route: '/inputtext' },
        ];
        this.optionFilterOrder = {
            keyWord: null,
            orderTrackingNumber: null,
            fromDate: null,
            toDate: null,
        };
        this.loadingListOrder(this.pageIndex, this.pageSize);
        this.optionsStatus = [
            {
                name: this.getStatusDeal(Statusdeal.BankAccount),
                value: Statusdeal.BankAccount,
            },
            {
                name: this.getStatusDeal(Statusdeal.DirectCommission),
                value: Statusdeal.DirectCommission,
            },
            {
                name: this.getStatusDeal(Statusdeal.IndirectCommission),
                value: Statusdeal.IndirectCommission,
            },
        ];
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
            // {
            //     name: this.getStatusText(OrderStatus.Cancelled).text,
            //     value: OrderStatus.Cancelled,
            // },
        ];

        // this.optionsStatusTextTest = [
        //     {
        //         name: 'Chờ duyệt',
        //         value: 0,
        //     },
        //     {
        //         name: 'Đã duyệt',
        //         value: 1,
        //     },
        //     {
        //         name: 'Chờ xử lí',
        //         value: 2,
        //     },
        //     {
        //         name: 'Thành công',
        //         value: 3,
        //     },
        //     {
        //         name: 'Hủy',
        //         value: 4,
        //     },
        // ];
        // this.previousStatusId = this.selectedStatusId || null;
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

    updateStatusOrder(): void {
        if (this.issubmit) {
            return;
        }

        if (this.selectedStatusId === 'default') {
            this.isStatusNotSelected = true;
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Hãy chọn trạng thái cho đơn hàng trước khi cập nhật',
            });
            return;
        }

        this.issubmit = true;

        const data = {
            id: this.orderGetID!.id,
            orderStatus: this.selectedStatusId,
            note: this.orderGetID?.note || '',
        };

        if (this.selectedStatusId === OrderStatus.Cancelled) {
            this.isDisabled = true;
        }

        this.orderService.update(data).subscribe({
            next: () => {
                this.issubmit = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: `Đã lưu trạng thái: ${
                        this.getStatusText(this.selectedStatusId).text
                    }`,
                });
                this.loadingListOrder();
                setTimeout(() => {
                    this.visible = false;
                }, 1000);
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.',
                });
                this.issubmit = false;
            },
        });
    }

    getStatusDeal(statusDeal: any): string {
        switch (statusDeal) {
            case Statusdeal.BankAccount:
                return 'Ngân hàng';
            case Statusdeal.DirectCommission:
                return 'Trực tiếp';
            case Statusdeal.IndirectCommission:
                return 'Gián tiếp';
            // case Statusdeal.DirectIndirectCommission:
            //     return '50% trực tiếp, 50% gián tiếp';

            default:
                return '';
        }
    }

    loadingListOrder(
        pageIndex: number = this.pageIndex,
        pageSize: number = this.pageSize,
        filterData: any = null
    ) {
        const request = {
            pageIndex: pageIndex,
            pageSize: pageSize,
            ...filterData,
        };
        console.log(request);
        this.orderService.getPaging(request).subscribe(
            (response) => {
                if (response && response.data) {
                    this.orderList = response.data.items || [];
                    this.totalItems = response.data.totalRecords || 0;
                    this.pageIndex = response.data.pageIndex;
                    this.pageSize = response.data.pageSize;
                    // this.filteredOrderList = [...this.orderList];
                    this.updatePageReport();
                } else {
                    this.orderList = [];
                    this.totalItems = 0;
                }
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: ' Lỗi khi lấy danh sách đơn hàng',
                });
            }
        );
    }

    updatePageReport() {
        const startRecord = (this.pageIndex - 1) * this.pageSize + 1;
        const endRecord = Math.min(
            startRecord + this.pageSize - 1,
            this.totalItems
        );
        this.currentPageReport = ` <b>${startRecord}</b> - <b>${endRecord}</b> trong <b>${this.totalItems}</b> bản ghi`;
    }

    onPageChange(event: any) {
        if (this.isPageSizeChanging) {
            this.isPageSizeChanging = false;
            return;
        }

        this.pageIndex = event.page + 1;
        this.pageSize = event.rows;

        console.log(
            'Page Changed - Index:',
            this.pageIndex,
            'Page Size:',
            this.pageSize
        );

        this.EvenFilter();
    }

    onPageSizeChange(event: any) {
        this.isPageSizeChanging = true;
        this.pageSize = event.value;
        this.pageIndex = 1;

        this.EvenFilter();
    }

    getOrderByID(id: number) {
        const request = {
            Id: id,
        };
        this.orderService.getById(request).subscribe(
            (response) => {
                if (response && response.data) {
                    this.orderGetID = response.data || [];
                    this.showDialogs = true;
                } else {
                    this.orderList = [];
                    this.totalItems = 0;
                }
                // this.selectedStatusId = this.orderGetID.orderStatus;
                this.originalStatusId = this.orderGetID.orderStatus;
                this.selectedStatusId = this.originalStatusId;
                if (
                    this.selectedStatusId === 4 ||
                    this.selectedStatusId === 3
                ) {
                    this.isDisabled = true;
                    this.isnote = true;
                } else {
                    this.isDisabled = false;
                    this.isnote = false;
                }
            },
            (error) => {
                console.error('Lỗi khi tải danh sách đơn hàng:', error);
            }
        );
    }

    closeDialog2(form: NgForm) {
        if (form) {
            form.resetForm();
        }
        this.orderGetID = null;
        this.showDialogs = false;
    }

    adjustToLocal(date: Date | null, isStartDate: boolean = true): string {
        if (!date) return '';

        const adjustedDate = new Date(date);

        if (isStartDate) {
            adjustedDate.setHours(0, 0, 0, 0);
        } else {
            adjustedDate.setHours(23, 59, 59, 999);
        }

        const year = adjustedDate.getFullYear();
        const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
        const day = String(adjustedDate.getDate()).padStart(2, '0');

        // return `${year}-${month}-${day}`;
        return `${year}-${month}-${day}`;
    }

    EvenFilter() {
        let FromDate: string | null = null;
        let ToDate: string | null = null;

        if (this.date) {
            FromDate = this.adjustToLocal(this.date, true);
        }
        if (this.date1) {
            ToDate = this.adjustToLocal(this.date1, false);
        }

        if (
            this.date &&
            this.date1 &&
            new Date(this.date) > new Date(this.date1)
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: ' Ngày kết thúc phải sau ngày bắt đầu',
            });
            return;
        }

        const filterData = {
            KeyWord: (this.optionFilterOrder.keyWord || '').trim(),
            FromDate: FromDate || '',
            ToDate: ToDate || '',
            PaymentTypes: this.selectedBranchId?.value,
            OrderStatus: this.selectedStatusId?.value,
        };

        const filteredData = Object.keys(filterData)
            .filter(
                (key) =>
                    filterData[key] !== null &&
                    filterData[key] !== undefined &&
                    filterData[key] !== ''
            )
            .reduce((obj, key) => {
                obj[key] = filterData[key];
                return obj;
            }, {});

        this.loadingListOrder(this.pageIndex, this.pageSize, filteredData);
        window.scrollTo(0, 0);
    }

    onStatusChange(event: any) {
        this.selectedStatusId = event.value;
        if (!this.selectedStatusId) {
            this.isStatusNotSelected = true;
        } else {
            this.isStatusNotSelected = false;
        }
    }

    // onStatusChange(event: any) {
    //     const newSelectedStatusId = event.value;
    //     const nextValidStatusId = this.originalStatusId + 1;
    //     const nextValidStatusId1 = this.originalStatusId + 2;

    //     if(this.originalStatusId <2){

    //         if (newSelectedStatusId === this.originalStatusId || newSelectedStatusId === nextValidStatusId) {
    //             const nextStatusText = this.getStatusText(nextValidStatusId);

    //             this.messageService.add({
    //                 severity: 'info',
    //                 summary: 'Thông báo',
    //                 detail: `Trạng thái hiện tại đơn hàng là: ${nextStatusText.text}, nhấn cập nhật để lưu`,
    //             });

    //             this.selectedStatusId = newSelectedStatusId;
    //             this.isValidStatusSelected = true;
    //             return
    //         } else {
    //             const nextStatusText = this.getStatusText(nextValidStatusId);
    //             this.messageService.add({
    //                 severity: 'warn',
    //                 summary: 'Thông báo',
    //                 detail: 'Trạng thái tiếp theo đơn hàng phải là ' + nextStatusText.text,
    //             });

    //             this.selectedStatusId = this.originalStatusId;

    //         }}
    //         if(this.originalStatusId>=2){
    //             if (newSelectedStatusId === this.originalStatusId || newSelectedStatusId === nextValidStatusId || newSelectedStatusId === nextValidStatusId1) {
    //                 const nextStatusText = this.getStatusText(nextValidStatusId);

    //                 this.messageService.add({
    //                     severity: 'info',
    //                     summary: 'Thông báo',
    //                     detail: `Trạng thái hiện tại đơn hàng là: ${nextStatusText.text}, nhấn cập nhật để lưu`,
    //                 });

    //                 this.selectedStatusId = newSelectedStatusId;
    //                 this.isValidStatusSelected = true;
    //                  return
    //             } else {
    //                 const nextStatusText = this.getStatusText(nextValidStatusId);
    //                 const nextStatusText1 = this.getStatusText(nextValidStatusId1);
    //                 this.messageService.add({
    //                     severity: 'warn',
    //                     summary: 'Thông báo',
    //                     detail: 'Trạng thái tiếp theo đơn hàng phải là ' + nextStatusText.text + ' hoặc ' + nextStatusText1.text ,
    //                 });

    //                 this.selectedStatusId = this.originalStatusId;

    //             }
    //         }
    //     }

    @Output() close = new EventEmitter<void>();

    closeModal() {
        this.close.emit();
    }
    toggleSelectAll(event: any) {
        this.selectAll = event.checked;
        this.orderList.forEach((order) => {
            order.selected = this.selectAll;
        });
    }

    onRowSelectChange() {
        const allSelected = this.orderList.every((order) => order.selected);
        this.selectAll = allSelected;
    }
    onDialogHide() {}

    // approveNextStatus(): void {
    //     if (this.selectedStatusId === OrderStatus.Cancelled ) {
    //       this.messageService.add({
    //         severity: 'info',
    //         summary: 'Thông báo',
    //         detail: 'Trạng thái đơn hàng đã đạt mức cuối cùng',
    //       });
    //       return;
    //     }

    //     const currentIndex = this.optionsStatusText.findIndex(
    //       (status) => status.value === this.selectedStatusId
    //     );
    //     const nextIndex = currentIndex + 1;

    //     if (nextIndex < this.optionsStatusText.length) {
    //       this.selectedStatusId = this.optionsStatusText[nextIndex].value;

    //       this.messageService.add({
    //         severity: 'info',
    //         summary: 'Thông báo',
    //         detail: ` Trạng thái hiện tại : ${
    //           this.getStatusText(this.selectedStatusId).text
    //         }, Nhấn cập nhật để lưu`,
    //       });
    //     }
    //   }

    //   approveNextStatus1(order: any): void {
    //     // Nếu trạng thái hiện tại là "Hủy", không duyệt tiếp
    //     if (order.orderStatus === OrderStatus.Cancelled) {
    //       this.messageService.add({
    //         severity: 'info',
    //         summary: 'Thông báo',
    //         detail: 'Trạng thái đơn hàng đã đạt mức cuối cùng: Hủy.',
    //       });
    //       return;
    //     }

    //     // Tìm trạng thái hiện tại và chuyển sang trạng thái tiếp theo
    //     const currentIndex = this.optionsStatusText.findIndex(
    //       (status) => status.value === order.orderStatus
    //     );
    //     const nextIndex = currentIndex + 1;

    //     if (nextIndex < this.optionsStatusText.length) {
    //       const nextStatus = this.optionsStatusText[nextIndex].value;

    //       // Gửi API để lưu trạng thái mới
    //       const data = {
    //         id: order.id,
    //         orderStatus: nextStatus,
    //         note: order.note || '',
    //       };

    //       this.orderService.update(data).subscribe(() => {
    //         // Cập nhật trạng thái trên giao diện
    //         order.orderStatus = nextStatus;

    //         // Hiển thị thông báo
    //         this.messageService.add({
    //           severity: 'success',
    //           summary: 'Thành công',
    //           detail: `Đơn hàng đã được chuyển sang trạng thái: ${
    //             this.getStatusText(nextStatus).text
    //           }`,
    //         });
    //       });
    //     }
    //   }
}
