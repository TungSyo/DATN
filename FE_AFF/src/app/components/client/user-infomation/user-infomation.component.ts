import { VoucherService } from './../../../core/services/voucher.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserCurrent } from 'src/app/core/models/identity/user-current.interface';
import { AddressService } from 'src/app/core/services/address.service';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { ProductApiService } from 'src/app/core/services/product-home.service';
import { UserService } from 'src/app/core/services/user.service';
import { WithdrawService } from 'src/app/core/services/withdraw.service';
import { environment } from 'src/environments/environment';
import { noWhitespaceValidator } from '../shared/validator';

@Component({
    selector: 'app-user-infomation',
    templateUrl: './user-infomation.component.html',
    styleUrl: './user-infomation.component.scss',
    providers: [MessageService],
})
export class UserInfomationComponent implements OnInit {
    user: UserCurrent | null = null;
    ImgUrl: string = environment.baseApiImageUrl;
    urlFE: string = environment.baseFeUrl;
    data: any[] = [];
    userId: number;
    downLevel: number;
    zoomScale: number = 1;
    visibleDialogWithDraw: boolean = false;
    isDragging = false;
    startX = 0;
    startY = 0;
    scrollLeft = 0;
    scrollTop = 0;
    messages: any[] = [];
    directAmount: number = 0; // Hoa hồng
    indirectAmount: number = 0; // Điểm thưởng
    nonIndirectAmount: number = 0; // Tiền có thể rút
    withdrawableAmount: number = 0; // Tổng tiền

    currentOrderStatus: string = 'pending';
    withdrawForm: FormGroup;
    isSubmitting: boolean = false;
    isSubmittingText: string = '';
    baseUrl: string = environment.baseApiImageUrl;
    transferContent: string = '';

    bank: any;
    bankAccount: any;
    accountName: any;
    voucheres: any;
    buttonLabel = 'Tạo mã giảm';

    updateUserVisible: boolean = false;
    updateUserForm: FormGroup;

    isDropdownCity: boolean = false;
    isDropdownDistrict: boolean = false;
    isDropdownWard: boolean = false;
    isDropdownBank: boolean = false;

    dataToSendOtp: any;
    cities: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    selectedCity: any = null;

    filteredCities: any;
    filteredDistricts: any;
    filteredWards: any;
    filteredBankes: any;

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

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private treeDataService: OrganizationService,
        private withdrawService: WithdrawService,
        private messageService: MessageService,
        private userreward: ProductApiService,
        private voucherService: VoucherService,
        private addressService: AddressService,
        private userService: UserService
    ) {
        this.withdrawForm = this.formBuilder.group({
            commission: [null, [Validators.required]],
            paymentMethod: [1, [Validators.required]],
        });

        this.updateUserForm = this.formBuilder.group({
            name: [null, [Validators.required]],
            citizenIdentification: [
                null,
                [Validators.required, noWhitespaceValidator()],
            ],
            personalTaxCode: [null],
            cityId: [null],
            cityName: [null],
            districtId: [null],
            districtName: [null],
            wardId: [null],
            wardName: [null],
            address: [null],
            bankName: [null],
            bankAccountNumber: [null],
        });
    }

    ngOnInit(): void {
        this.fetchUserCurrent();
        this.fetchCommissionAndReward();
        this.bankAccount = '9383716351';
        this.bank = 'PhamXuanManh';
        this.accountName = 'PhamXuanManh';
        this.transferContent = 'dfssd';
        this.withdrawForm
            .get('paymentMethod')
            ?.valueChanges.subscribe((value) => {
                if (value === 1) {
                    this.buttonLabel = 'Tạo mã giảm';
                } else {
                    this.buttonLabel = 'Rút tiền';
                }
            });

        this.loadCities();
        this.filteredBankes = [...this.bankes];
    }

    loadVoucher() {
        this.voucherService
            .getPaging({
                pageIndex: 1,
                pageSize: 10,
                userId: this.user?.id,
                voucherStatus: 0,
            })
            .subscribe((voucher) => {
                console.log(voucher);
                this.voucheres = voucher.data.items;
            });
    }

    showDialogWithDraw() {
        if (this.user.bankAccountNumber && this.user.bankName) {
            this.visibleDialogWithDraw = true;
        } else {
            this.visibleDialogWithDraw = false;

            let messageDetail = '';
            if (!this.user.bankAccountNumber && !this.user.bankName) {
                messageDetail =
                    'Vui lòng cập nhật số tài khoản và tên ngân hàng';
            } else if (!this.user.bankAccountNumber) {
                messageDetail = 'Vui lòng cập nhật số tài khoản';
            } else if (!this.user.bankName) {
                messageDetail = 'Vui lòng cập nhật tên ngân hàng';
            }

            this.messageService.add({
                severity: 'warn',
                summary: 'Chú ý',
                detail: messageDetail,
            });
        }
    }

    showUpdateUserDal() {
        this.updateUserVisible = true;
        this.updateUserForm.patchValue({
            name: this.user.name,
            citizenIdentification:
                this.user.citizenIdentification == ''
                    ? null
                    : this.user.citizenIdentification,
            personalTaxCode: this.user.personalTaxCode,
            cityId: this.user?.cityId,
            cityName: this.user.cityName,
            districtId: this.user.districtId,
            districtName: this.user.districtName,
            wardId: this.user.wardId,
            wardName: this.user.wardName,
            address: this.user.address,
            bankName: this.user.bankName,
            bankAccountNumber: this.user.bankAccountNumber,
        });
        this.loadDistricts({ id: this.user?.cityId });
        this.loadWards({ id: this.user?.districtId });
    }

    // fetchCommissionAndReward(): void {
    //     this.userreward.getapiComission().subscribe(
    //         (response) => {
    //             if (response && response.status) {
    //                 this.directAmount =
    //                     response.data.commission.directAmount || 0;
    //                 this.indirectAmount =
    //                     response.data.commission.indirectAmount || 0;
    //             }
    //         },
    //         (error) => {
    //             console.error('Error fetching commission and reward:', error);
    //         }
    //     );
    // }
    fetchCommissionAndReward(): void {
        this.userreward.getapiComission().subscribe(
            (response) => {
                if (response && response.status) {
                    this.directAmount =
                        response.data.commission.directAmount || 0;
                    this.indirectAmount =
                        response.data.commission.indirectAmount || 0;
                    this.nonIndirectAmount =
                        response.data.commission.nonIndirectAmount || 0;

                    this.withdrawableAmount =
                        this.indirectAmount - this.nonIndirectAmount;
                }
            },
            (error) => {
                console.error('Error fetching commission and reward:', error);
            }
        );
    }

    copyText(contentType: string, id = null) {
        let textToCopy = '';
        let copiedItem = '';

        if (contentType === 'accountNumber') {
            textToCopy =
                this.urlFE +
                '/register-referal?referralCode=' +
                document.getElementById('accountNumber')?.innerText || '';
            copiedItem = 'mã giới thiệu';
        } else if (contentType === 'voucher') {
            textToCopy =
                document.getElementById(`voucher-code-${id}`)?.innerText || '';
            copiedItem = 'mã voucher';
        }

        if (textToCopy) {
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = textToCopy;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);

            this.messageService.add({
                severity: 'success',
                summary: 'Chú ý',
                detail: `Đã copy ${copiedItem}`,
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Chú ý',
                detail: `Không có ${copiedItem} để copy.`,
            });
        }
    }
    onDialogHide() {
        console.log(2);
        this.updateUserForm.reset();
    }
    fetchUserCurrent(): void {
        this.authService.fetchUserCurrent().subscribe(
            (response) => {
                if (response.status) {
                    this.user = response.data;
                    this.filterData(this.user.id);
                    this.loadVoucher();
                }
            },
            (error) => {
                console.error('Error fetching user data', error);
            }
        );
    }

    zoomIn() {
        this.zoomScale += 0.1; // Adjust the increment as needed
    }

    // Hàm thu nhỏ (nếu bạn muốn thêm chức năng thu nhỏ)
    zoomOut() {
        const zoomOutStep = 0.1; // Customize this value to control zoom-out speed
        this.zoomScale = Math.max(0.5, this.zoomScale - zoomOutStep);
    }

    onMouseDown(event: MouseEvent) {
        this.isDragging = true;
        this.startX = event.clientX;
        this.startY = event.clientY;
        const treeContainer = document.querySelector('.tree-container');
        if (treeContainer) {
            this.scrollLeft = treeContainer.scrollLeft;
            this.scrollTop = treeContainer.scrollTop;
        }
    }

    onMouseMove(event: MouseEvent) {
        if (!this.isDragging) return;
        event.preventDefault();
        const treeContainer = document.querySelector('.tree-container');
        if (treeContainer) {
            const x = event.clientX - this.startX;
            const y = event.clientY - this.startY;
            treeContainer.scrollLeft = this.scrollLeft - x;
            treeContainer.scrollTop = this.scrollTop - y;
        }
    }

    onMouseUp() {
        this.isDragging = false;
    }

    filterData(userId: number, downLevel: number = 10): void {
        this.treeDataService.getTreeData(userId, downLevel).subscribe(
            (response: any) => {
                if (response.status) {
                    this.data = [this.transformToChartData(response.data)];
                }
            },
            (error) => {
                console.error('Error fetching tree data:', error);
            }
        );
    }

    loadData() {
        this.filterData(this.user.id, this.downLevel);
        this.messages = [
            {
                severity: 'success',
                summary: 'Thành công',
                detail: 'Dữ liệu đã được cập nhật',
                life: 1000,
            },
        ];
    }

    transformToChartData(node: any, currentLevel: number = 1): any {
        if (currentLevel > 20) {
            return null;
        }
        const children =
            node.children
                ?.map((child: any) =>
                    this.transformToChartData(child, currentLevel + 1)
                )
                .filter((child: any) => child !== null) || [];

        const sortedChildren = children.sort((a: any, b: any) => {
            if (a.position === 'left' && b.position === 'right') {
                return -1; // Move the 'left' child before 'right'
            } else if (a.position === 'right' && b.position === 'left') {
                return 1; // Move the 'right' child after 'left'
            }
            return 0; // No change in order if both are the same position or undefined
        });

        return {
            name: node.user.name,
            avatarUrl: node.user.avatarUrl,
            level: node.level,
            position: node.position,
            children: sortedChildren.length ? sortedChildren : [],
        };
    }

    toggleExpand(person: any) {
        person.expanded = !person.expanded;
    }


    handleDeleteVoucher(id: any) {
        console.log(id);
        const request = {
            id: id,
        };
        console.log(request);
        this.voucherService.deleteHard(request).subscribe((response) => {
            if (response.status) {
                this.loadVoucher();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Xóa voucher thành công',
                });
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Thất bại',
                    detail: response.message,
                });
            }
        });
    }

    handleUpdateUser() {
        console.log(this.updateUserForm.value);
        if (this.updateUserForm.valid) {
            const formData = {
                id: this.user.id,
                name: this.updateUserForm.get('name').value,
                citizenIdentification: this.updateUserForm.get(
                    'citizenIdentification'
                ).value,
                personalTaxCode:
                    this.updateUserForm.get('personalTaxCode').value,
                cityId: this.updateUserForm.get('cityId').value,
                cityName: this.updateUserForm.get('cityName').value,
                districtId: this.updateUserForm.get('districtId').value,
                districtName: this.updateUserForm.get('districtName').value,
                wardId: this.updateUserForm.get('wardId').value,
                wardName: this.updateUserForm.get('wardName').value,
                address: this.updateUserForm.get('address').value,
                bankName: this.updateUserForm.get('bankName').value,
                bankAccountNumber:
                    this.updateUserForm.get('bankAccountNumber').value,
            };
            this.userService.updateUserClient(formData).subscribe((result) => {
                this.updateUserForm.reset();
                this.fetchUserCurrent();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Cập nhật thông tin thành công',
                });

                this.updateUserVisible = false;
            });
        } else {
            this.updateUserForm.markAllAsTouched();
        }
    }

    onSubmit(): void {
        console.log(2);
        if (this.withdrawForm.valid) {
            console.log(this.withdrawForm.value.paymentMethod);
            if (this.withdrawForm.value.paymentMethod == 1) {
                const formData = {
                    name: '',
                    description: '',
                    // image: `https://img.vietqr.io/image/voucher-print.jpg?amount=${this.withdrawForm.value.commission}`,
                    image: `https://img.vietqr.io/image/${this.bank}-${this.bankAccount
                        }-print.jpg?amount=${this.withdrawForm.value.commission
                        }&addInfo=${encodeURIComponent(
                            this.transferContent
                        )}&accountName=${encodeURIComponent(this.accountName)}`,
                    voucherAmount: this.withdrawForm.value.commission,
                    userCreatedId: this.user?.id,
                    // userUsedId: this.user?.id,
                };
                if (this.withdrawForm.value.commission >= 1000000) {
                    this.voucherService
                        .create(formData)
                        .subscribe((response) => {
                            console.log(response);
                            if (response.status == true) {
                                this.visibleDialogWithDraw = false;
                                this.withdrawForm.patchValue({
                                    commission: null,
                                });

                                this.loadVoucher();
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Thành công',
                                    detail: 'Rút tiền thành công',
                                });
                            } else {
                                this.messageService.add({
                                    severity: 'warn',
                                    summary: 'Chú ý',
                                    detail: response.message,
                                });
                            }
                        });
                } else {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Chú ý',
                        detail: 'Tối thiểu rút trên 1.000.000 điểm !',
                    });
                }
            } else if (this.withdrawForm.value.paymentMethod == 2) {
                const formData = {
                    commission: this.withdrawForm.value.commission * 0.9,
                    vat: this.withdrawForm.value.commission * 0.1,
                    userBuyId: this.user?.id,
                    type: 2,
                    status: 1,
                    paymentType: 2,
                };
                if (this.withdrawForm.value.commission >= 1000000) {
                    this.withdrawService
                        .create(formData)
                        .subscribe((response) => {
                            if (response.status) {
                                this.visibleDialogWithDraw = false;
                                this.withdrawForm.patchValue({
                                    commission: null,
                                });
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Thành công',
                                    detail: 'Rút tiền thành công',
                                });
                            } else {
                                this.messageService.add({
                                    severity: 'warn',
                                    summary: 'Chú ý',
                                    detail: response.message,
                                });
                            }
                        });
                } else {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Chú ý',
                        detail: 'Tối thiểu rút trên 1.000.000 điểm !',
                    });
                }
            }
        } else {
            this.withdrawForm.markAllAsTouched();
        }
        console.log('onSubmit');
    }

    //Update user
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const clickedInside =
            (event.target &&
                (event.target as HTMLElement).closest(
                    '.city-address .dropdown-list'
                )) ||
            (event.target && (event.target as HTMLElement).closest('.city'));
        if (!clickedInside) {
            this.isDropdownCity = false;
        }

        const clickedInsideDistrict =
            (event.target &&
                (event.target as HTMLElement).closest(
                    '.district-address .dropdown-list'
                )) ||
            (event.target &&
                (event.target as HTMLElement).closest('.district'));
        if (!clickedInsideDistrict) {
            this.isDropdownDistrict = false;
        }

        const clickedInsideWard =
            (event.target &&
                (event.target as HTMLElement).closest(
                    '.ward-address .dropdown-list'
                )) ||
            (event.target && (event.target as HTMLElement).closest('.ward'));
        if (!clickedInsideWard) {
            this.isDropdownWard = false;
        }

        const clickedInsideBank =
            (event.target &&
                (event.target as HTMLElement).closest(
                    '.bankes .dropdown-list'
                )) ||
            (event.target && (event.target as HTMLElement).closest('.bank'));
        if (!clickedInsideBank) {
            this.isDropdownBank = false;
        }
    }

    searchCity(keyword: string) {
        this.filteredCities = this.cities.filter((city) =>
            city.name.toLowerCase().includes(keyword.toLowerCase())
        );
    }
    searchDistrict(keyword: string) {
        this.filteredDistricts = this.districts.filter((city) =>
            city.name.toLowerCase().includes(keyword.toLowerCase())
        );
    }
    searchWard(keyword: string) {
        this.filteredWards = this.wards.filter((city) =>
            city.name.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    loadCities(): void {
        this.addressService
            .getCitiesByIdCountry({ id: 1 })
            .subscribe((item) => {
                this.cities = item.data;
                this.filteredCities = [...this.cities];
            });
    }

    loadDistricts(city: any): void {
        this.addressService
            .getDistricts({ cityId: city.id })
            .subscribe((item) => {
                this.districts = item.data;
                this.filteredDistricts = [...this.districts];
            });
    }

    loadWards(city: any): void {
        this.addressService
            .getWards({ districtId: city.id })
            .subscribe((item) => {
                this.wards = item.data;
                this.filteredWards = [...this.wards];
            });
    }

    handleSelectBank(city: any, event: MouseEvent) {
        this.updateUserForm.patchValue({
            bankName: city.shortName,
        });
        this.isDropdownBank = false;
    }

    handleSelectCity(city: any, event: MouseEvent) {
        this.updateUserForm.patchValue({
            cityName: city.name,
            cityId: city.id,
        });

        this.updateUserForm.patchValue({
            districtName: null,
            districtId: null,
        });
        this.updateUserForm.patchValue({
            wardName: null,
            wardId: null,
        });
        this.loadDistricts(city);
        this.isDropdownCity = false;
    }

    handleSelectDistrict(city: any, event: MouseEvent) {
        this.updateUserForm.patchValue({
            districtName: city.name,
            districtId: city.id,
        });
        this.updateUserForm.patchValue({
            wardName: null,
            wardId: null,
        });
        this.loadWards(city);
        this.isDropdownDistrict = false;
    }

    handleSelectWard(city: any, event: MouseEvent) {
        this.updateUserForm.patchValue({
            wardName: city.name,
            wardId: city.id,
        });
        this.isDropdownWard = false;
    }

    searchBank(keyword: string) {
        this.filteredBankes = this.bankes.filter((city) =>
            city.shortName.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    showCities() {
        console.log(1);

        this.isDropdownCity = true;
    }
}
