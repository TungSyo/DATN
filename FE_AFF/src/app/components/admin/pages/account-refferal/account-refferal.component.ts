// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-account-refferal',
//   templateUrl: './account-refferal.component.html',
//   styleUrls: ['./account-refferal.component.css']
// })
// export class AccountRefferalComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }

// // import { Component, OnInit } from '@angular/core';

// // @Component({
// //   selector: 'app-account-user',
// //   templateUrl: './account-user.component.html',
// //   styleUrls: ['./account-user.component.css']
// // })
// // export class AccountUserComponent implements OnInit {

// //   constructor() { }

// //   ngOnInit() {
// //   }

// // }

import { WithdrawService } from './../../../../core/services/withdraw.service';
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import {
    emailValidator,
    noWhitespaceValidator,
    referralCodeNotMatchingPhoneNumberValidator,
} from 'src/app/components/client/shared/validator';
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
import { AddressService } from 'src/app/core/services/address.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { UserService } from 'src/app/core/services/identity/user.service';

import Swal from 'sweetalert2';

@Component({
    selector: 'app-account-refferal',
    templateUrl: './account-refferal.component.html',
    styleUrls: ['./account-refferal.component.css'],
    providers: [MessageService],
})
export class AccountRefferalComponent {
    items: MenuItem[] | undefined;
    formatdate: string = 'dd/mm/yy';
    optionsStatusText: any;
    messages: any[] = [];
    optionsStatus: any;
    withDrawById: any;
    users: any;

    updateUserModalVisible: boolean = false;
    updateStatusModalVisible: boolean = false;
    selectedStatusId: any;
    isDisabled: boolean = false;
    updateUserForm: FormGroup;

    cities: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    selectedCountryId!: number;
    selectedCityId!: number;
    selectedDistrictId!: number;
    selectedWardId!: number;
    bankes = [
        {
            id: 1,
            fullName: 'Ngân hàng Ngoại thương Việt Nam',
            shortName: 'Vietcombank',
        },
        {
            id: 2,
            fullName: 'Ngân hàng Công thương Việt Nam',
            shortName: 'VietinBank',
        },
        {
            id: 3,
            fullName: 'Ngân hàng Đầu tư và Phát triển Việt Nam',
            shortName: 'BIDV',
        },
        {
            id: 4,
            fullName: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam',
            shortName: 'Agribank',
        },
        {
            id: 5,
            fullName: 'Ngân hàng Kỹ thương Việt Nam',
            shortName: 'Techcombank',
        },
        { id: 6, fullName: 'Ngân hàng Quân đội', shortName: 'MB Bank' },
        { id: 7, fullName: 'Ngân hàng Á Châu', shortName: 'ACB' },
        { id: 8, fullName: 'Ngân hàng Tiên Phong', shortName: 'TPBank' },
        {
            id: 9,
            fullName: 'Ngân hàng Việt Nam Thịnh Vượng',
            shortName: 'VPBank',
        },
        {
            id: 10,
            fullName: 'Ngân hàng Phát triển TP.HCM',
            shortName: 'HDBank',
        },
        {
            id: 11,
            fullName: 'Ngân hàng Sài Gòn Thương Tín',
            shortName: 'Sacombank',
        },
        {
            id: 12,
            fullName: 'Ngân hàng Thương mại Cổ phần Đông Á',
            shortName: 'DongA Bank',
        },
        {
            id: 13,
            fullName: 'Ngân hàng Bưu điện Liên Việt',
            shortName: 'LienVietPostBank',
        },
        { id: 14, fullName: 'Ngân hàng Quốc tế Việt Nam', shortName: 'VIB' },
        { id: 15, fullName: 'Ngân hàng Sài Gòn', shortName: 'SCB' },
        {
            id: 16,
            fullName: 'Ngân hàng Đại chúng Việt Nam',
            shortName: 'PVcomBank',
        },
        { id: 17, fullName: 'Ngân hàng Bắc Á', shortName: 'Bac A Bank' },
        {
            id: 18,
            fullName: 'Ngân hàng Thương mại Cổ phần Xuất nhập khẩu Việt Nam',
            shortName: 'Eximbank',
        },
        {
            id: 19,
            fullName: 'Ngân hàng Thương mại Cổ phần An Bình',
            shortName: 'ABBank',
        },
        { id: 20, fullName: 'Ngân hàng Bảo Việt', shortName: 'BaoViet Bank' },
        { id: 21, fullName: 'Ngân hàng Nam Á', shortName: 'Nam A Bank' },
        { id: 22, fullName: 'Ngân hàng Việt Á', shortName: 'VietABank' },
        { id: 23, fullName: 'Ngân hàng Sài Gòn Hà Nội', shortName: 'SHB' },
        { id: 24, fullName: 'Ngân hàng Đông Nam Á', shortName: 'SeABank' },
        { id: 25, fullName: 'Ngân hàng Kiên Long', shortName: 'KienlongBank' },
        { id: 26, fullName: 'Ngân hàng Hàng Hải', shortName: 'MSB' },
        { id: 27, fullName: 'Ngân hàng Phương Đông', shortName: 'OCB' },
        {
            id: 28,
            fullName: 'Ngân hàng Bản Việt',
            shortName: 'VietCapitalBank',
        },
        {
            id: 29,
            fullName: 'Ngân hàng Nhà nước Việt Nam',
            shortName: 'State Bank of Vietnam (SBV)',
        },
    ];
    filteredBankes: any;
    filteredBankesDrop: any;
    userCurrent: any = {};
    phoneNumber: any;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private withdrawService: WithdrawService,
        private messageService: MessageService,
        private userService: UserService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private addressService: AddressService
    ) {
        this.updateUserForm = this.formBuilder.group({
            id: [null],
            name: [null, [Validators.required, noWhitespaceValidator()]],
            phoneNumber: [null, [Validators.required, noWhitespaceValidator()]],
            email: [
                null,
                [
                    Validators.required,
                    Validators.email,
                    emailValidator,
                    noWhitespaceValidator(),
                ],
            ],
            password: [null, [Validators.required, noWhitespaceValidator()]],
            citizenIdentification: [
                null,
                [Validators.required, noWhitespaceValidator()],
            ],
            referralCode: [null, referralCodeNotMatchingPhoneNumberValidator()],
            dateOfBirth: [null],
            cityId: [null],
            cityName: [null],
            districtId: [null],
            districtName: [null],
            wardId: [null],
            wardName: [null],
            address: [null],
            personalTaxCode: [null],
            bankName: [null],
            bankAccountNumber: [null],
        });

        this.filteredBankes = [...this.bankes];
        this.filteredBankesDrop = [...this.bankes];
    }

    ngOnInit() {
        this.items = [{ label: 'Danh sách rút tiền' }];
        this.getCitiesByCountry(1);
        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
            this.phoneNumber = user.phoneNumber;
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
            };

            this.queryParameters = {
                ...params,
                status: params['bankName'] ? params['bankName'] : null,
                keyWord: params['keyWord'] ? params['keyWord'] : null,
                referralCode: params['referralCode']
                    ? params['referralCode']
                    : null,
            };
            this.getUsers(request);
        });

        if (this.queryParameters.userBuyId) {
        }
    }

    public getUsers(request: any): any {
        this.userService
            .getPaggingRefferal(request)
            .subscribe((result: any) => {
                if (result.status) {
                    if (
                        request.pageIndex !== 1 &&
                        result.data.items.length === 0
                    ) {
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
                    this.users = result.data.items;

                    // this.users = this.users.map((staffPosition: any) => ({
                    //     ...staffPosition,
                    //     staffPositionStatusLable:
                    //         this.constant.staffPosition.status.find(
                    //             (status: any) =>
                    //                 status.value?.toString() ==
                    //                 staffPosition.staffPositionStatus?.toString()
                    //         )?.label ?? '',
                    // }));

                    if (this.users.length === 0) {
                        this.paging.pageIndex = 1;
                    }

                    const { items, ...paging } = result.data;
                    this.paging = paging;
                }
            });
    }

    getUserById(data: any): void {
        console.log(data);
        this.updateUserModalVisible = true;
        this.updateUserForm = this.formBuilder.group({
            id: [data.id],
            name: [data.name, [Validators.required, noWhitespaceValidator()]],
            phoneNumber: [
                data.phoneNumber,
                [Validators.required, noWhitespaceValidator()],
            ],
            email: [
                data.email,
                [
                    Validators.required,
                    Validators.email,
                    emailValidator,
                    noWhitespaceValidator(),
                ],
            ],
            password: [null, [Validators.required, noWhitespaceValidator()]],
            citizenIdentification: [
                data.citizenIdentification,
                [Validators.required, noWhitespaceValidator()],
            ],
            referralCode: [
                data.phoneNumber,
                referralCodeNotMatchingPhoneNumberValidator(),
            ],
            dateOfBirth: [data.dateOfBirth],
            cityId: [data.cityId],
            cityName: [data.cityName],
            districtId: [data.districtId],
            districtName: [data.districtName],
            wardId: [data.wardId],
            wardName: [data.wardName],
            address: [data.address],
            personalTaxCode: [data.personalTaxCode],
            bankName: [data.bankName],
            bankAccountNumber: [data.bankAccountNumber],
        });

        this.getDistrictsByCity(this.updateUserForm.value?.cityId);
        this.getWardsByDistrict(this.updateUserForm.value?.districtId);
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
        keyWord: null,
        bankName: null,
    };

    searchBank(event: any): void {
        const keyword = event.query?.trim().toLowerCase() || ''; // Kiểm tra keyword có hợp lệ
        if (!keyword) {
            this.filteredBankes = []; // Trả về danh sách rỗng nếu không có từ khoá
            return;
        }

        // Lọc ngân hàng dựa trên keyword
        this.filteredBankes = this.bankes.filter((bank) =>
            bank.shortName?.toLowerCase().includes(keyword)
        );
    }

    searchBankDrop(event: any): void {
        const keyword = event.query?.trim().toLowerCase() || ''; // Kiểm tra keyword có hợp lệ
        if (!keyword) {
            this.filteredBankesDrop = []; // Trả về danh sách rỗng nếu không có từ khoá
            return;
        }

        // Lọc ngân hàng dựa trên keyword
        this.filteredBankesDrop = this.bankes.filter((bank) =>
            bank.shortName?.toLowerCase().includes(keyword)
        );
    }

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

    public handleSearchUser() {
        const request = {
            keyWord: this.queryParameters.keyWord
                ? this.queryParameters.keyWord.trim()
                : '',
            bankName: this.queryParameters.bankName
                ? this.queryParameters.bankName.shortName.trim()
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
            id: this.updateUserForm.value?.id,
            name: this.updateUserForm.value?.name,
            email: this.updateUserForm.value?.email,
            cityId: this.updateUserForm.value?.cityId,
            cityName: this.updateUserForm.value?.cityName,
            districtId: this.updateUserForm.value?.districtId,
            districtName: this.updateUserForm.value?.districtName,
            wardId: this.updateUserForm.value?.wardId,
            wardName: this.updateUserForm.value?.wardName,
            bankName: this.updateUserForm.value?.bankName?.shortName,
            bankAccountNumber: this.updateUserForm.value?.bankAccountNumber,
            personalTaxCode: this.updateUserForm.value?.personalTaxCode,
            citizenIdentification:
                this.updateUserForm.value?.citizenIdentification,
            dateOfBirth: this.updateUserForm.value?.dateOfBirth,
            address: this.updateUserForm.value?.address,

            phoneNumber: this.updateUserForm.value?.phoneNumber,

            referralCode: this.updateUserForm.value?.referralCode,
        };
        console.log(formData);
        this.userService.updateUser(formData).subscribe((item: any) => {
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
                };

                this.queryParameters = {
                    ...params,
                    bankName: params['startDate'] ? params['fromDate'] : null,
                    endDate: params['endDate'] ? params['fromDate'] : null,
                };

                this.getUsers(request);
            });
            this.updateUserModalVisible = false;
        });
    }

    getCitiesByCountry(countryId: number) {
        console.log(countryId);
        this.addressService
            .getCitiesByIdCountry({ id: countryId })
            .subscribe((cities) => {
                this.cities = cities.data;
                //console.log(cities)
            });
    }

    getDistrictsByCity(cityId: number) {
        console.log(cityId);
        this.addressService
            .getDistrictsByIdCity({ cityId: cityId })
            .subscribe((districts) => {
                this.districts = districts.data;
            });
    }

    getWardsByDistrict(districtId: number) {
        console.log(districtId);
        this.addressService
            .getWardsByIdDistrict({ districtId: districtId })
            .subscribe((wards) => {
                this.wards = wards.data;
            });
    }

    onCountryChange(countryId: number) {
        this.selectedCountryId = countryId;
        this.getCitiesByCountry(countryId);
        this.districts = [];
        this.wards = [];
    }

    onCityChange(data: any) {
        console.log(data);
        this.selectedCityId = data.value;
        this.getDistrictsByCity(data.value);
        this.districts = [];
        this.wards = [];

        console.log(this.districts);
        this.updateUserForm.get('wardId')?.setValue(null);
        this.updateUserForm.get('districtId')?.setValue(null);
    }

    onDistrictChange(districtId: any) {
        this.selectedDistrictId = districtId.value;
        this.getWardsByDistrict(districtId.value);
        this.wards = [];
        this.updateUserForm.get('wardId')?.setValue(null);
    }

    onClearCity() {
        this.updateUserForm.get('wardId')?.setValue(null);
        this.updateUserForm.get('districtId')?.setValue(null);

        this.districts = [];
        this.wards = [];
    }

    onClearDistrict() {
        this.wards = [];
        this.updateUserForm.get('wardId')?.setValue(null);
    }

    onClearWard() {
        this.updateUserForm.get('wardId')?.setValue(null);
    }
}
