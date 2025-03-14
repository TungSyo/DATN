import { WithdrawService } from './../../../../core/services/withdraw.service';
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import pagingConfig, {
    DEFAULT_PAGE_INDEX,
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZE_OPTIONS,
    DEFAULT_PER_PAGE_OPTIONS,
} from 'src/app/core/configs/paging.config';
import systemConfig from 'src/app/core/configs/system.config';
import animationConstant from 'src/app/core/constants/animation.constant';
import bannerConstant from 'src/app/core/constants/banner.constant';
import orderConstant from 'src/app/core/constants/order.Constant';
import sortConstant from 'src/app/core/constants/sort.Constant';
import withdrawConstant from 'src/app/core/constants/withdraw.constant';
import { OrderStatus } from 'src/app/core/enums/order-status.enum';
import { PermissionConstants } from 'src/app/core/models/permissions';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { UserService } from 'src/app/core/services/identity/user.service';

import Swal from 'sweetalert2';

@Component({
    selector: 'app-withdraw',
    templateUrl: './withdraw.component.html',
    styleUrls: ['./withdraw.component.css'],
    providers: [MessageService],
})
export class WithdrawComponent {
    items: MenuItem[] | undefined;
    formatdate: string = 'dd/mm/yy';
    optionsStatusText: any;
    messages: any[] = [];
    optionsStatus: any;
    withDrawById: any;

    updateStatusModalVisible: boolean = false;
    selectedStatusId: any;
    isDisabled: boolean = false;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private withdrawService: WithdrawService,
        private messageService: MessageService,
        private userService: UserService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.items = [{ label: 'Danh sách rút điểm thưởng' }];

        this.optionsStatus = [
            {
                name: 'Chờ duyệt',
                value: '0',
            },
            {
                name: 'Đã duyệt',
                value: '1',
            },
            {
                name: 'Chờ xử lý',
                value: '2',
            },
            {
                name: 'Thành công',
                value: '3',
            },
            // {
            //     name: 'Hủy',
            //     value: '4',
            // },
        ];

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

        this.loadUsers().then(() => {
            this.route.queryParams.subscribe((params) => {
                const request = {
                    ...params,
                    pageIndex:
                        params['pageIndex'] || this.config.paging.pageIndex,
                    pageSize: params['pageSize'] || this.config.paging.pageSize,
                    type: 2,
                };

                this.queryParameters = {
                    ...params,
                    startDate: params['startDate'] ? params['fromDate'] : null,
                    endDate: params['endDate'] ? params['fromDate'] : null,
                    status: params['status'] ? params['status'] : null,
                    code: params['code'] ? params['code'] : null,
                    userBuyId: params['userBuyId']
                        ? this.users.find(
                              (user) => user.id === +params['userBuyId']
                          ) || null
                        : null,
                };
                this.getWithDraw(request);
            });
        });

        if (this.queryParameters.userBuyId) {
        }
    }

    loadUsers(): Promise<void> {
        return new Promise((resolve) => {
            this.userService.getPaging({}).subscribe((users) => {
                this.users = users.data.items;
                resolve(); // Hoàn tất tải dữ liệu
            });
        });
    }

    onUserSelected(event: any) {
        if (typeof event === 'number') {
            const user = this.users.find((u) => u.id === event);
            if (user) {
                this.queryParameters.userBuyId = user; // Gán lại đối tượng người dùng đầy đủ
            }
        }
    }

    // getWithDrawById(item: any) {
    //     const userPermissions =
    //         this.authService.getUserCurrent()?.permissions || [];
    //     const hasRequiredPermissions = [
    //         PermissionConstants.ManageOrderUpdateStatus,
    //     ].some((permission) => userPermissions.includes(permission));
    //     const hasRequiredPermissions2 = [
    //         PermissionConstants.Admin,
    //         PermissionConstants.Master,
    //     ].some((permission) => userPermissions.includes(permission));
    //     if (hasRequiredPermissions || hasRequiredPermissions2) {
    //         // this.selectedStatusId = this.orderGetID.orderStatus;
    //         console.log( this.withDrawById?.status);

    //         if (
    //             this.withDrawById?.status === 4 ||
    //             this.withDrawById?.status === 3
    //         ) {
    //             this.isDisabled = true;
    //         } else {
    //             this.isDisabled = false;
    //         }
    //         this.isDisabled = false;
    //         this.updateStatusModalVisible = true;
    //         this.withDrawById = item;
    //         this.selectedStatusId = item.status.toString();
    //         // }
    //     } else {
    //         this.messages = [
    //             {
    //                 severity: 'warn',
    //                 summary: 'Cảnh báo',
    //                 detail: 'Bạn không có quyền truy cập',
    //                 life: 3000,
    //             },
    //         ];
    //     }
    // }
    getWithDrawById(item: any) {
        // Chỉ xử lý nếu item.type === 2
        if (item.type !== 2) {
            this.messages = [
                {
                    severity: 'warn',
                    summary: 'Cảnh báo',
                    detail: 'Dữ liệu không hợp lệ',
                    life: 3000,
                },
            ];
            return; // Thoát sớm nếu không thỏa mãn điều kiện
        }

        const userPermissions =
            this.authService.getUserCurrent()?.permissions || [];
        const hasRequiredPermissions = [
            PermissionConstants.ManageOrderUpdateStatus,
        ].every((permission) => userPermissions.includes(permission));
        const hasRequiredPermissions2 = [
            PermissionConstants.Admin,
            PermissionConstants.Master,
        ].some((permission) => userPermissions.includes(permission));

        if (hasRequiredPermissions || hasRequiredPermissions2) {
            console.log(this.withDrawById?.status);

            // Cập nhật giá trị `isDisabled` dựa trên `status`
            if (item.status === 3 || item.status === 4) {
                this.isDisabled = true; // Disable dropdown nếu status là 3 hoặc 4
            } else {
                this.isDisabled = false; // Enable dropdown nếu status khác 3 hoặc 4
            }

            this.updateStatusModalVisible = true;
            this.withDrawById = item;
            this.selectedStatusId = item.status.toString();
        } else {
            this.messages = [
                {
                    severity: 'warn',
                    summary: 'Cảnh báo',
                    detail: 'Bạn không có quyền truy cập',
                    life: 3000,
                },
            ];
        }
    }

    getStatusText(statusOrder): string {
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
                return 'Hủy';
            default:
                return '';
        }
    }

    //config default
    public config: any = {
        paging: pagingConfig.default,
        baseUrl: systemConfig.baseFileSystemUrl,
        perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
        pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    };

    public constant: any = {
        order: orderConstant,
        sort: sortConstant,
        withdraw: withdrawConstant,
    };

    //withdraws
    public withdraws: any = [];

    public paging: any = {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: '',
        orderBy: '',
        totalRecords: 0,
        totalPages: 0,
    };

    public selectedWithdraws: any = [];

    public queryParameters: any = {
        ...this.config.paging,
        startDate: null,
        endDate: null,
        status: '',
        code: '',
    };

    public getWithDraw(request: any): any {
        this.withdrawService.getPaging(request).subscribe((result: any) => {
            if (result.status) {
                console.log(result);
                if (request.pageIndex !== 1 && result.data.items.length === 0) {
                    this.route.queryParams.subscribe((params) => {
                        const request = {
                            ...params,
                            pageIndex: 1,
                        };
                        this.router.navigate([], {
                            relativeTo: this.route,
                            queryParams: request,
                            queryParamsHandling: 'merge',
                        });
                    });
                }
                if (this.withdraws.length === 0) {
                    this.paging.pageIndex = 1;
                }
                this.withdraws = result.data.items;
                const { items, ...paging } = result.data;
                this.paging = paging;
                this.selectedWithdraws = [];
            }
        });
    }

    approveNextStatus(): void {
        if (this.selectedStatusId === 4) {
            this.messageService.add({
                severity: 'info',
                summary: 'Thông báo',
                detail: 'Trạng thái đơn hàng đã đạt mức cuối cùng: Hủy.',
            });
            return;
        }

        const currentIndex = this.optionsStatus.findIndex(
            (status) => status.value === this.selectedStatusId
        );
        const nextIndex = currentIndex + 1;

        if (nextIndex < this.optionsStatus.length) {
            this.selectedStatusId = this.optionsStatus[nextIndex].value;

            this.messageService.add({
                severity: 'info',
                summary: 'Thông báo',
                detail: ` Trạng thái hiện tại : ${this.getStatusTextT(
                    this.selectedStatusId
                )}, Nhấn cập nhật để lưu`,
            });
        }
    }
    getStatusTextT(id: number): string {
        const status = this.optionsStatus.find((option) => option.value === id);
        return status ? status.name : '';
    }

    // updateStatus() {
    //     const formData = {
    //         id: this.withDrawById.id,
    //         status: this.selectedStatusId,
    //         vat: this.withDrawById.vat,
    //         code: this.withDrawById.code,
    //         commission: this.withDrawById.commission,
    //         userBuyId: this.withDrawById.userBuyId,
    //         buyNumber: this.withDrawById.buyNumber,
    //         type: this.withDrawById.type,
    //     };

    //     this.updateStatusModalVisible = false;
    //     this.withdrawService.update(formData).subscribe((item: any) => {
    //         this.messageService.add({
    //             severity: 'success',
    //             summary: 'Thành công',
    //             detail: 'Cập nhật thành công',
    //         });
    //         this.route.queryParams.subscribe((params) => {
    //             const request = {
    //                 ...params,
    //                 pageIndex: params['pageIndex']
    //                     ? params['pageIndex']
    //                     : this.config.paging.pageIndex,
    //                 pageSize: params['pageSize']
    //                     ? params['pageSize']
    //                     : this.config.paging.pageSize,
    //             };

    //             this.queryParameters = {
    //                 ...params,
    //                 startDate: params['startDate'] ? params['fromDate'] : null,
    //                 endDate: params['endDate'] ? params['fromDate'] : null,
    //             };

    //             this.getWithDraw(request);
    //         });
    //     });
    // }

    handleOpenCreateBanner() {
        this.router.navigate(['/admin/pages/banner/create']);
    }

    public selectAllwithdraws(event: any): void {
        if (event.target.checked) {
            this.selectedWithdraws = this.withdraws.map(
                (teacher: any) => teacher.id
            );
        } else {
            this.selectedWithdraws = [];
        }
    }

    public handleOnSortAndOrderChange(orderBy: string): void {
        if (this.paging.orderBy === orderBy) {
            this.paging.sortBy =
                this.paging.sortBy === this.constant.sort.asc
                    ? this.constant.sort.desc
                    : this.constant.sort.asc;
        } else {
            this.paging.sortBy = sortConstant.desc;
        }

        this.paging = {
            orderBy: orderBy,
            sortBy: this.paging.sortBy,
        };

        this.route.queryParams.subscribe((params) => {
            const request = {
                ...params,
                orderBy: this.paging.orderBy,
                sortBy: this.paging.sortBy,
            };

            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: request,
                queryParamsHandling: 'merge',
            });
        });
    }

    public handleSelectItem(id: number): void {
        if (this.isSelected(id)) {
            this.selectedWithdraws = this.selectedWithdraws.filter(
                (id: any) => id !== id
            );
        } else {
            this.selectedWithdraws.push(id);
        }
    }

    public isSelected(id: number): boolean {
        return this.selectedWithdraws.includes(id);
    }

    public handleSearchWithdraws() {
        const request = {
            code: this.queryParameters.code
                ? this.queryParameters.code.trim()
                : '',
            userBuyId: this.queryParameters.userBuyId
                ? this.queryParameters.userBuyId?.id
                : '',
            status: this.queryParameters.status
                ? `${this.queryParameters.status}`
                : '',
        };

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: request,
            queryParamsHandling: 'merge',
        });
    }

    public handleDeleteItem(id: number) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                cancelButton: 'btn btn-danger ml-2',
                confirmButton: 'btn btn-success',
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons
            .fire({
                title: `Bạn có chắc muốn xoá banner có Id ${id}?`,
                text: 'Sau khi xoá bản sẽ không thể khôi phục dữ liệu!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Bỏ qua',
                reverseButtons: false,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const request = {
                        id: id,
                    };
                }
            });
    }

    public handleOnDeleteMultiple() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                cancelButton: 'btn btn-danger ml-2',
                confirmButton: 'btn btn-success',
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons
            .fire({
                title: `Bạn có muốn xoá các bản ghi có Id: ${this.selectedWithdraws.join(
                    ', '
                )} không?`,
                text: 'Sau khi xoá bản sẽ không thể khôi phục dữ liệu!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Bỏ qua',
                reverseButtons: false,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const request = {
                        ids: this.selectedWithdraws,
                    };
                }
            });
    }

    onPageChange(event: any) {
        this.paging.pageIndex = event.page + 1;
        this.paging.pageSize = event.rows;
        this.route.queryParams.subscribe((params) => {
            const request = {
                ...params,
                pageIndex: event.page + 1,
                pageSize: event.rows,
            };

            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: request,
                queryParamsHandling: 'merge',
            });
        });
    }

    users: any;
    filterUserSuggestions(event: any): void {
        const query = event.query.toLowerCase();
        // this.users = this.users.filter(
        //     (user) =>
        //         user.name.toLowerCase().includes(query) ||
        //         user.phoneNumber.toLowerCase().includes(query)
        // );
        this.userService.getPaging({ name: query }).subscribe((res) => {
            this.users = res.data.items;
        });
    }

    getSourceName(type: number): string {
        switch (type) {
            case 1:
                return 'Tiền thưởng hoa hồng';
            case 2:
                return 'Yêu cầu rút tiền';
            case 3:
                return 'Mua hàng bằng điểm';
            default:
                return 'Không xác định';
        }
    }

    getFormattedAmount(
        commission: number | null | undefined,
        type: number
    ): { text: string; color: string } {
        if (commission === null || commission === undefined) {
            return { text: '', color: '' };
        }

        const formattedAmount = commission.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });

        if (type === 1) {
            return { text: `- ${formattedAmount}`, color: 'red' };
        } else if (type === 2) {
            return { text: ` ${formattedAmount}`, color: 'red' };
        } else if (type === 3) {
            return { text: ` ${formattedAmount}`, color: 'red' };
        }

        return { text: formattedAmount, color: '' };
    }

    updateStatus() {
        const formData = {
            id: this.withDrawById.id,
            status: this.selectedStatusId,
            // vat: this.withDrawById.vat,
            // code: this.withDrawById.code,
            // commission: this.withDrawById.commission,
            // userBuyId: this.withDrawById.userBuyId,
            // buyNumber: this.withDrawById.buyNumber,
            // type: this.withDrawById.type,
        };
        console.log(formData);

        // this.updateStatusModalVisible = false;
        this.withdrawService.update1(formData).subscribe((item: any) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Cập nhật thành công',
            });
            this.route.queryParams.subscribe((params) => {
                const request = {
                    ...params,
                    pageIndex: params['pageIndex']
                        ? params['pageIndex']
                        : this.config.paging.pageIndex,
                    pageSize: params['pageSize']
                        ? params['pageSize']
                        : this.config.paging.pageSize,
                    type: 2,
                };

                this.queryParameters = {
                    ...params,
                    startDate: params['startDate'] ? params['fromDate'] : null,
                    endDate: params['endDate'] ? params['fromDate'] : null,
                };

                this.getWithDraw(request);
            });
            this.updateStatusModalVisible = false;
        });
    }
}
