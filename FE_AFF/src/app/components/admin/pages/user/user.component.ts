import { version } from 'moment-timezone';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    NgForm,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { OptionsFilterCommodities } from 'src/app/core/models/option-filter-commodities';
// import { BranchService } from 'src/app/core/services/branch.service';
import { RoleService } from 'src/app/core/services/role.service';
import { AddressService } from 'src/app/core/services/address.service';
import { catchError, forkJoin, of } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { PermissionConstants } from 'src/app/core/models/permissions';
import { AuthService } from 'src/app/core/services/identity/auth.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
    providers: [MessageService],
})
export class UserComponent implements OnInit {
    filterForm!: FormGroup;
    totalRecords: number = 0;
    maxLength: number = 100;
    isSubmitting: boolean = false;
    isWhitespaceOnlys: boolean = false;
    showDialog4 = false;
    selectedCommodityId: number | null = null;
    branch: any[] = [];
    Roles: any[] = [];
    Roles2: any[] = [];
    PageIndex: number = 1;
    PageSize: number = 30;
    PageIndex2: number = 1;
    PageSize2: number = 10000;
    WordSearch: string = '';
    RoleGroupForm!: FormGroup;
    RoleGroupForm2!: FormGroup;
    pageSize: number = 30;
    pageNumber: number = 1;
    Name!: string;
    PhoneNumber!: string;
    Address!: string;
    users: any[] = [];
    commodities: any[] = [];
    commoditiesForm!: FormGroup;
    commoditiesForm2!: FormGroup;
    selectedName!: string;
    selectedPhoneNumber!: string;
    selectedAddress!: string;
    savingInProgress = false;
    roleSelected: boolean = false;
    roleGroupId: number | null = null;
    selectedRoleGroupId: number | null = null;
    cities: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    selectedCountryId!: number;
    selectedCityId!: number;
    selectedDistrictId!: number;
    selectedWardId!: number;
    passwordHash: string;
    initialPhoneNumber: string = '';
    initialEmail: string = '';

    optionsFilterCommodities: OptionsFilterCommodities =
        new OptionsFilterCommodities();

    autoCompleteCustomer: any;
    autoCompleteEmployeeDraw: any;

    selectedItem: any;
    commoditySelected: any;
    commoditiesSearch: any;

    listSubjects: any;
    subjectSelected: any;
    createdAt: any;
    messages!: any[];
    comodity: any;
    employessById!: any;
    employessId2: any;

    errorMessage: string | null = null;
    showNameError: boolean = false;
    showNameError2: boolean = false;
    showNameError3: boolean = false;
    showNameError4: boolean = false;
    showNameError5: boolean = false;
    showNameError6: boolean = false;
    showNameError7: boolean = false;
    showDialog = false;
    showDialog2 = false;
    showDialog3 = false;
    rolesError: boolean = false;
    items: MenuItem[] | undefined;

    formatdate: string = 'dd/mm/yy';
    autoCompleteSubject: any;
    currentPageReport: string = '';
    isRolesTouched: boolean = false;
    visible: boolean = false;
    lockoutEnabled: boolean = false;

    showDialog1() {
        this.visible = true;
    }

    constructor(
        private usersService: UserService,
        // private branchService: BranchService,
        private roleService: RoleService,
        private addressService: AddressService,
        private messageService: MessageService,
        private toastService: ToastService,
        private router: Router,
        private authService: AuthService,
        private fb: FormBuilder
    ) {
        this.RoleGroupForm = this.fb.group({
            name: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(100),
                    this.noWhitespaceValidator,
                ]),
            ],
            phoneNumber: [
                '',
                [
                    Validators.required,
                    this.noWhitespaceValidator,
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            branchId: [null, Validators.required],
            roles: [[], Validators.required],
            branchName: [null, Validators.required],
            email: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.email,
                    this.noWhitespaceValidator,
                ]),
            ],
            password: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(100),
                    this.noWhitespaceValidator,
                ]),
            ],
            referralCode: [null],
            branches: [null, Validators.required],
            address: [null, Validators.required],
            wardId: [null],
            cityId: [null],
            districtId: [null],
        });
        this.RoleGroupForm2 = this.fb.group({
            id: [''],
            name: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(100),
                    this.noWhitespaceValidator,
                ]),
            ],
            phoneNumber: [
                '',
                [
                    Validators.required,
                    this.noWhitespaceValidator,
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            branchId: [null, Validators.required],
            roles: [[], Validators.required],
            branchName: [null, Validators.required],
            email: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(100),
                    this.noWhitespaceValidator,
                ]),
            ],
            password: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(100),
                    this.noWhitespaceValidator,
                ]),
            ],
            address: [null, Validators.required],
            wardId: [null],
            cityId: [null],
            referralCode: [null],
            branches: [null, Validators.required],
            districtId: [null],
            lockoutEnabled: [false],
        });
    }

    isWhitespace(str: string) {
        return str.trim().length === 0;
    }

    get rolesControl() {
        return this.RoleGroupForm.get('roles');
    }

    get rolesControl2() {
        return this.RoleGroupForm2.get('roles');
    }

    get emailControl() {
        return this.RoleGroupForm.get('email');
    }

    // onBranchChange(event) {}
    onBranchChange(event: any): void {
        const selectedBranchId = event.value;
        const selectedBranch = this.branch.find(
            (branch) => branch.id === selectedBranchId
        );

        if (selectedBranch) {
            // Add selected branch to the roles form control
            const branchsControl = this.RoleGroupForm.get('branches');
            const currentBranches = branchsControl.value || [];
            if (!currentBranches.includes(selectedBranch)) {
                branchsControl.setValue([...currentBranches, selectedBranch]);
            }
        }
    }

    onBranchUpdateChange(event: any): void {
        const selectedBranchId = event.value;
        const selectedBranch = this.branch.find(
            (branch) => branch.id === selectedBranchId
        );

        if (selectedBranch) {
            // Add selected branch to the roles form control
            const branchesControl = this.RoleGroupForm2.get('branches');
            const currentBranches = branchesControl.value || [];
            const isBranchExist = currentBranches.some(
                (branch) => branch.id === selectedBranch.id
            );

            if (!isBranchExist) {
                branchesControl.setValue([...currentBranches, selectedBranch]);
            }
        }
    }

    // Hàm kiểm tra khi rời khỏi p-multiSelect
    checkRolesSelection() {
        // Kiểm tra nếu trường chưa có giá trị
        if (!this.rolesControl?.value || this.rolesControl.value.length === 0) {
            this.rolesControl.setErrors({ required: true }); // Đặt lỗi required
            this.rolesControl.markAsTouched(); // Đánh dấu trường là touched
        } else {
            this.rolesControl.setErrors(null); // Xóa lỗi nếu đã chọn giá trị
        }
    }

    checkRolesSelection2() {
        // Kiểm tra nếu trường chưa có giá trị
        if (
            !this.rolesControl2?.value ||
            this.rolesControl2.value.length === 0
        ) {
            this.rolesControl2.setErrors({ required: true }); // Đặt lỗi required
            this.rolesControl2.markAsTouched(); // Đánh dấu trường là touched
        } else {
            this.rolesControl2.setErrors(null); // Xóa lỗi nếu đã chọn giá trị
        }
    }

    get username() {
        return this.RoleGroupForm.get('username');
    }

    ngOnInit() {
        this.items = [
            { icon: 'pi pi-home', route: '/installation' },
            { label: 'Quản trị hệ thống' },
            { label: 'Quản lý tài khoản' },
        ];
        this.getCitiesByCountry(1);
        this.Filters();
        this.getAllFilterRole();
        // this.getAllFilterRole3();
        this.getAllFilterBranch();
    }

    getAllFilterBranch(): void {
        // this.branchService.getBranchsAll().subscribe((response: any) => {
        //     this.branch = response.data.items;
        // });
    }

    getAllFilterRole(): void {
        this.roleService
            .getRoleAll(this.PageSize, this.PageIndex)
            .subscribe((response: any) => {
                this.Roles = response.data.items;

                // Check if the "Employee" role with ID 8 exists
                const employeeRole = this.Roles.find(
                    (role) => role.id === 8 && role.name === 'Employee'
                );

                if (employeeRole) {
                    // If found, pre-select the Employee role
                    this.RoleGroupForm.get('roles').setValue([employeeRole]); // Set as selected in the form control
                }
            });
    }

    // getAllFilterRole3(): void {
    //     this.roleService.getRoleAll(this.PageSize2, this.PageIndex2).subscribe((response: any) => {
    //         this.Roles2 = response.data.items;
    //     });
    // }

    getCitiesByCountry(countryId: number) {
        this.addressService
            .getCitiesByIdCountry({ id: countryId })
            .subscribe((cities) => {
                this.cities = cities.data;
                //console.log(cities)
            });
    }

    getDistrictsByCity(cityId: number) {
        this.addressService
            .getDistrictsByIdCity({ cityId: cityId })
            .subscribe((districts) => {
                this.districts = districts.data;
            });
    }

    getWardsByDistrict(districtId: number) {
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

    onCityChange(cityId: number) {
        this.selectedCityId = cityId;
        this.getDistrictsByCity(cityId);
        this.districts = [];
        this.wards = [];
        this.RoleGroupForm.get('wardId')?.setValue(null);
        this.RoleGroupForm.get('districtId')?.setValue(null);
    }

    onDistrictChange(districtId: number) {
        this.selectedDistrictId = districtId;
        this.getWardsByDistrict(districtId);
        this.wards = [];
        this.RoleGroupForm.get('wardId')?.setValue(null);
    }

    onClearCity() {
        this.RoleGroupForm.get('wardId')?.setValue(null);
        this.RoleGroupForm.get('districtId')?.setValue(null);
    }

    onClearDistrict() {
        this.RoleGroupForm.get('wardId')?.setValue(null);
    }

    onClearWard() {
        this.RoleGroupForm.get('wardId')?.setValue(null);
    }

    Filters(): void {
        //debugger
        this.usersService
            .getFilters(
                this.PageSize,
                this.PageIndex,
                this.Name,
                this.PhoneNumber,
                this.Address
            )
            // .pipe(
            //     catchError((error) => {
            //         if (error.status === 403) {
            //             // alert('Bạn không có quyền truy cập tài nguyên này.');

            //             this.toastService.showError(
            //                 'Chú ý',
            //                 'Bạn không có quyền truy cập!'
            //             );
            //         }
            //         return of(null); // Trả về giá trị null để tiếp tục dòng chảy của Observable
            //     })
            // )
            .subscribe(
                (response) => {
                    this.users = response.data.items;
                    this.totalRecords = response.data.totalRecords;
                    this.updateCurrentPageReport();
                },
                (error) => {
                    console.error('Error fetching filtered customers:', error);
                }
            );
    }

    clickButtonFilter() {
        if (
            this.selectedName ||
            this.selectedPhoneNumber ||
            this.selectedAddress
        ) {
            this.Name = this.selectedName?.trim();
            this.PhoneNumber = this.selectedPhoneNumber?.trim();
            this.Address = this.selectedAddress?.trim();
            this.PageIndex = 1;
            const elementshighlight = document.querySelectorAll(
                `p-paginator .p-highlight`
            );
            elementshighlight.forEach((element) => {
                element.classList.remove('p-highlight');
            });
            const elements = document.querySelectorAll(
                `p-paginator [aria-label="Page 1"]`
            );
            elements.forEach((element) => {
                element.classList.add('p-highlight');
            });
            this.Filters();
        } else {
            this.Name = this.selectedName?.trim();
            this.PhoneNumber = this.selectedPhoneNumber?.trim();
            this.Address = this.selectedAddress?.trim();
            this.PageIndex = 1;
            const elementshighlight = document.querySelectorAll(
                `p-paginator .p-highlight`
            );
            elementshighlight.forEach((element) => {
                element.classList.remove('p-highlight');
            });
            const elements = document.querySelectorAll(
                `p-paginator [aria-label="Page 1"]`
            );
            elements.forEach((element) => {
                element.classList.add('p-highlight');
            });
            this.Filters();
        }
        this.Filters();
    }

    onInputChange(event: any) {
        const input = event.target;
        let trimmedValue = input.value.trim();
        if (trimmedValue.length > this.maxLength) {
            input.value = trimmedValue.substring(0, this.maxLength);
        }
        this.errorMessage = '';
    }

    noWhitespaceValidator(control: any) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { whitespace: true };
    }

    getErrorMessage() {
        if (this.RoleGroupForm.controls['name'].hasError('required')) {
            return 'Tên người dùng không được để trống';
        }
        return 'Tên người không được chứa toàn ký tự trắng';
    }

    getErrorMessage3() {
        if (this.RoleGroupForm.controls['email'].hasError('required')) {
            return 'Tên tài khoản không được để trống';
        }
        return 'Tên tài khoản không được chứa toàn ký tự trắng';
    }

    getErrorMessage4() {
        if (this.RoleGroupForm.controls['password'].hasError('required')) {
            return 'Mật khẩu không được để trống';
        }
        return 'Mật khẩu không được chứa toàn ký tự trắng';
    }

    getErrorMessage5() {
        if (this.RoleGroupForm.controls['phoneNumber'].hasError('required')) {
            return 'Số điện thoại không được để trống';
        }
        return 'Số điện thoại không được chứa toàn ký tự trắng';
    }

    getErrorMessage2() {
        if (this.RoleGroupForm2.controls['name'].hasError('required')) {
            return 'Tên nhân viên không được để trống';
        }
        return 'Tên nhân viên không được chứa toàn ký tự trắng';
    }

    onTextAreaChange(event: any) {
        const textarea = event.target;
        const trimmedValue = textarea.value.trim();
        const maxLength = 100;

        if (trimmedValue.length > maxLength) {
            textarea.value = trimmedValue.substring(0, maxLength);
            this.RoleGroupForm.get('description')?.setValue(textarea.value);
        }
    }

    // onPageChange(event: any) {
    //   this.optionsFilterCommodities.PageSize = event.rows;
    //   this.optionsFilterCommodities.PageIndex = event.page + 1;

    //   this.commodityService.FilterTCommondities(this.optionsFilterCommodities).subscribe((response) => {
    //     this.comodity = response.data;
    //     this.totalRecordsCount = response.totalRecordsCount;
    //   }, (err) => {
    //     this.comodity = null;
    //     this.totalRecordsCount = 0;
    //   })
    // }

    openDialog() {
        const userPermissions =
            this.authService.getUserCurrent()?.permissions || [];

        const hasRequiredPermissions = [
            PermissionConstants.ManageUser,
            PermissionConstants.ManageUserCreate,
        ].every((permission) => userPermissions.includes(permission));

        const hasRequiredPermissions2 = [
            PermissionConstants.Admin,
            PermissionConstants.Master,
        ].some((permission) => userPermissions.includes(permission));

        if (hasRequiredPermissions || hasRequiredPermissions2) {
            this.showDialog = true;
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

    closeDialog() {
        this.showDialog = false;
        this.RoleGroupForm.reset();
        this.showNameError = false;
        this.showNameError2 = false;
        this.showNameError3 = false;
        this.showNameError4 = false;
        this.showNameError5 = false;
        this.showNameError6 = false;
        this.showNameError7 = false;
        this.Filters();
    }

    getAllFilterRole2(): void {
        this.roleService
            .getRoleAll(this.PageSize2, this.PageIndex2)
            .subscribe((response: any) => {
                this.Roles2 = response.data.items.map((role: any) => ({
                    label: role.name, // Tên của role
                    value: role.id,
                    normalizedName: role.normalizedName, // Giá trị là ID của role
                }));
            });
    }

    maskPassword(password: string): string {
        // Nếu password quá dài, chỉ lấy 8 dấu sao
        return password.length > 8
            ? '*******************'
            : '*******************'.slice(0, password.length);
    }

    openDialog2(userId: number): void {
        const userPermissions =
            this.authService.getUserCurrent()?.permissions || [];

        const hasRequiredPermissions = [
            PermissionConstants.ManageUser,
            PermissionConstants.ManageUserEdit,
        ].every((permission) => userPermissions.includes(permission));

        const hasRequiredPermissions2 = [
            PermissionConstants.Admin,
            PermissionConstants.Master,
        ].some((permission) => userPermissions.includes(permission));

        if (hasRequiredPermissions || hasRequiredPermissions2) {
            this.employessId2 = userId;
            this.getAllFilterRole2();
            this.usersService.getUserById(userId).subscribe(
                (response: any) => {
                    this.employessById = response.data;
                    this.getDistrictsByCity(this.employessById.cityId);
                    this.getWardsByDistrict(this.employessById.districtId);
                    const userRoleIds = this.employessById.roles.map(
                        (role: any) => role.id
                    );
                    this.passwordHash = this.employessById.passwordHash;
                    this.showDialog2 = true;
                    if (this.employessById.phoneNumber !== null) {
                        const phonNumberTrim =
                            this.employessById.phoneNumber.trim();
                        this.employessById.phoneNumber = phonNumberTrim;
                    }
                    this.RoleGroupForm2.patchValue({
                        id: this.employessById.id,
                        name: this.employessById.name,
                        phoneNumber: this.employessById.phoneNumber,
                        email: this.employessById.email,
                        referralCode: this.employessById.referralCode,
                        address: this.employessById.address,
                        password: this.maskPassword(this.passwordHash),
                        branchId: this.employessById.branchId,
                        branchName: this.employessById.branchName,
                        cityId: this.employessById.cityId,
                        cityName: this.employessById.cityName,
                        districtId: this.employessById.districtId,
                        districtName: this.employessById.districtName,
                        wardId: this.employessById.wardId,
                        wardName: this.employessById.wardName,
                        // branchGroup: this.branch.find(branch => branch.id === this.employessById.branchId),
                        roles: userRoleIds,
                        branches: this.employessById.branches,
                        lockoutEnabled:
                            this.employessById.isLockAccount === false
                                ? true
                                : false,
                    });
                    console.log(this.RoleGroupForm2);

                    this.initialPhoneNumber = this.employessById.phoneNumber;
                    this.initialEmail = this.employessById.email;
                },
                (error) => {
                    console.error('Error:', error);
                }
            );
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

    closeDialog2() {
        this.showDialog2 = false;
        this.RoleGroupForm2.reset();
        this.showNameError = false;
        this.showNameError2 = false;
        this.showNameError3 = false;
        this.showNameError4 = false;
        this.showNameError5 = false;
        this.showNameError6 = false;
        this.showNameError7 = false;
        this.Filters();
    }

    onItemSelected2(event: any) {
        const selectedRole = event.value;
        if (selectedRole) {
            this.RoleGroupForm2.patchValue({
                branchId: selectedRole.id,
                branchName: selectedRole.name,
            });
        }
    }

    onInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const trimmedValue = inputElement.value.trim(); // Cắt ký tự khoảng trắng ở hai đầu chuỗi
        this.optionsFilterCommodities.name = trimmedValue;
    }

    redirectToUpdateCustomerPage(id: number): void {
        this.router.navigate(['/update-template-rd', id]);
    }

    openDialog4(id: number) {
        this.selectedCommodityId = id;
        this.showDialog4 = true;
    }

    closeDialog4() {
        this.showDialog4 = false;
    }

    onKeyPress(event: KeyboardEvent) {
        const inputChar = event.key;
        if (!this.isNumberKey(inputChar)) {
            event.preventDefault();
        }
    }

    isNumberKey(char: string) {
        return /^\d+$/.test(char);
    }

    // confirmDelete() {
    //   if (this.selectedCommodityId !== null) {
    //     this.commodityService.deleteCommodity(this.selectedCommodityId).subscribe(
    //       response => {
    //         //console.log('Delete successful', response);
    //         // Refresh the data or handle the UI changes
    //         this.closeDialog4();
    //         this.getAllFilterRoleGroup();
    //       },
    //       error => {
    //         console.error('Error deleting commodity', error);
    //       }
    //     );
    //   }
    // }

    private isHttpError(error: any): error is { StatusCode: number } {
        return error && typeof error.StatusCode === 'number';
    }

    checkUserExistsAndSubmit() {
        const formValues = this.RoleGroupForm.value;

        // Gọi service để kiểm tra sự tồn tại của người dùng
        this.usersService
            .checkUserExists(formValues.phoneNumber, formValues.email)
            .subscribe(
                (response) => {
                    if (response.data === true) {
                        // Người dùng tồn tại, hiển thị thông báo lỗi
                        // this.messages.add({ severity: 'error', summary: 'Lỗi', detail: 'Số điện thoại hoặc email đã tồn tại!' });
                        this.messages = [
                            {
                                severity: 'warn',
                                summary: 'Lỗi',
                                detail: 'Số điện thoại hoặc email đã tồn tại!',
                                life: 3000,
                            },
                        ];
                    } else {
                        // Người dùng không tồn tại, gọi hàm onSubmit để tiếp tục
                        this.onSubmit();
                    }
                },
                (error) => {
                    // Xử lý lỗi khi gọi API
                    console.error(
                        'Có lỗi xảy ra khi kiểm tra tồn tại người dùng',
                        error
                    );
                }
            );
    }

    onPageChange(event: any): void {
        this.PageIndex = event.page + 1;
        this.PageSize = event.rows;
        this.Filters();
    }

    goToPreviousPage(): void {
        if (this.PageIndex > 1) {
            this.PageIndex--;
            this.Filters();
        }
    }

    goToNextPage(): void {
        const lastPage = Math.ceil(this.totalRecords / this.PageSize);
        if (this.PageIndex < lastPage) {
            this.PageIndex++;
            this.Filters();
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

    async onSubmit() {
        if (this.savingInProgress) {
            return;
        }

        this.isSubmitting = true;
        const formValues = this.RoleGroupForm.value;

        let hasError = false;

        if (!this.rolesControl?.value || this.rolesControl.value.length === 0) {
            this.rolesControl.setErrors({ required: true }); // Đặt lỗi required
            this.rolesControl.markAsTouched(); // Đánh dấu trường là touched
            hasError = true;
        } else {
            this.rolesControl.setErrors(null); // Xóa lỗi nếu đã chọn giá trị
        }

        if (
            this.emailControl.invalid &&
            this.emailControl.touched &&
            this.emailControl.value
        ) {
            this.showNameError6 = true;
            hasError = true;
        }

        if (!formValues.name || formValues.name.length === 0) {
            this.showNameError = true;
            hasError = true;
        }

        if (!formValues.email || formValues.email.length === 0) {
            this.showNameError3 = true;
            hasError = true;
        }

        if (!formValues.password || formValues.password.length === 0) {
            this.showNameError4 = true;
            hasError = true;
        }

        if (!formValues.phoneNumber || formValues.phoneNumber.length === 0) {
            this.showNameError5 = true;
            hasError = true;
        }

        // if (formValues.phoneNumber && formValues.phoneNumber.length != 10) {
        //     hasError = true;
        // }

        if (hasError) {
            this.messages = [
                {
                    severity: 'error',
                    summary: 'Không thể lưu vì:',
                    detail: 'Thông tin đang có lỗi cần được chỉnh sửa',
                    life: 5000,
                },
            ];
            this.isSubmitting = false;
            return;
        }
        try {
            this.savingInProgress = true;
            const selectedCity =
                this.cities.find((city) => city.id === formValues.cityId)
                    ?.name || '';
            const selectedDistrict =
                this.districts.find(
                    (district) => district.id === formValues.districtId
                )?.name || '';
            const selectedWard =
                this.wards.find((ward) => ward.id === formValues.wardId)
                    ?.name || '';

            // Tạo chuỗi địa chỉ bằng cách nối các giá trị lại với nhau
            const address =
                `${selectedCity} - ${selectedDistrict} - ${selectedWard}`.trim();

            // console.log(address);
            console.log(formValues);

            const userData = {
                name: formValues.name,
                email: formValues.email,
                phoneNumber: formValues.phoneNumber,
                password: formValues.password,
                address: address,
                status: true, // Hoặc giá trị khác nếu cần
                cityId: formValues.cityId,
                cityName:
                    this.cities.find(
                        (cities) => cities.id === formValues.cityId
                    )?.name || '',
                districtId: formValues.districtId,
                districtName:
                    this.districts.find(
                        (districts) => districts.id === formValues.districtId
                    )?.name || '',
                wardId: formValues.wardId,
                wardName:
                    this.wards.find((wards) => wards.id === formValues.wardId)
                        ?.name || '',
                roles: formValues.roles.map((role) => role.normalizedName),
            };

            // Gửi yêu cầu tới API để thêm người dùng
            this.usersService.createUser(userData).subscribe(
                (response) => {
                    console.log('Người dùng đã được tạo thành công', response);
                    this.messages = [
                        {
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Khách hàng đã được thêm thành công',
                            life: 3000,
                        },
                    ];
                    this.closeDialog(); // Đóng dialog sau khi thêm thành công
                },
                (error) => {
                    console.error('Có lỗi xảy ra khi thêm người dùng', error);
                }
            );
        } catch (error) {
            this.messages = [
                {
                    severity: 'error',
                    summary: 'Không thể lưu vì:',
                    detail: 'Thông tin đang có lỗi cần được chỉnh sửa',
                    life: 3000,
                },
            ];
            // this.filterCustomers();
        } finally {
            this.savingInProgress = false;
        }
    }

    checkUserExistsAndSubmit2() {
        const formValues = this.RoleGroupForm2.value;

        if (
            formValues.phoneNumber === this.initialPhoneNumber &&
            formValues.email === this.initialEmail
        ) {
            // Nếu không thay đổi, gọi hàm onSubmit để tiếp tục
            this.onUpdateSubmit();
            return;
        }

        // Gọi service để kiểm tra sự tồn tại của người dùng
        this.usersService
            .checkUserExists(formValues.phoneNumber, formValues.email)
            .subscribe(
                (response) => {
                    if (response.data === true) {
                        // Người dùng tồn tại, hiển thị thông báo lỗi
                        // this.messages.add({ severity: 'error', summary: 'Lỗi', detail: 'Số điện thoại hoặc email đã tồn tại!' });
                        this.messages = [
                            {
                                severity: 'warn',
                                summary: 'Lỗi',
                                detail: 'Số điện thoại hoặc email đã tồn tại!',
                                life: 3000,
                            },
                        ];
                    } else {
                        // Người dùng không tồn tại, gọi hàm onSubmit để tiếp tục
                        this.onUpdateSubmit();
                    }
                },
                (error) => {
                    // Xử lý lỗi khi gọi API
                    console.error(
                        'Có lỗi xảy ra khi kiểm tra tồn tại người dùng',
                        error
                    );
                }
            );
    }

    async onUpdateSubmit() {
        if (this.savingInProgress) {
            return;
        }

        this.isSubmitting = true;
        const formValues = this.RoleGroupForm2.value;

        let hasError = false;

        if (
            !this.rolesControl2?.value ||
            this.rolesControl2.value.length === 0
        ) {
            this.rolesControl2.setErrors({ required: true }); // Đặt lỗi required
            this.rolesControl2.markAsTouched(); // Đánh dấu trường là touched
            hasError = true;
        } else {
            this.rolesControl2.setErrors(null); // Xóa lỗi nếu đã chọn giá trị
        }

        if (
            this.emailControl.invalid &&
            this.emailControl.touched &&
            this.emailControl.value
        ) {
            this.showNameError6 = true;
            hasError = true;
        }

        if (!formValues.name || formValues.name.length === 0) {
            this.showNameError = true;
            hasError = true;
        }

        if (!formValues.email || formValues.email.length === 0) {
            this.showNameError3 = true;
            hasError = true;
        }

        if (!formValues.password || formValues.password.length === 0) {
            this.showNameError4 = true;
            hasError = true;
        }

        if (!formValues.phoneNumber || formValues.phoneNumber.length === 0) {
            this.showNameError5 = true;
            hasError = true;
        }

        if (hasError) {
            this.messages = [
                {
                    severity: 'error',
                    summary: 'Không thể lưu vì:',
                    detail: 'Thông tin đang có lỗi cần được chỉnh sửa',
                    life: 5000,
                },
            ];
            this.isSubmitting = false;
            return;
        }

        const selectedCity = this.cities.find(
            (city: any) => city.id === formValues.cityId
        );
        const cityName = selectedCity ? selectedCity.name : '';

        const selectedDistrict = this.districts.find(
            (dis: any) => dis.id === formValues.districtId
        );
        const districName = selectedDistrict ? selectedDistrict.name : '';

        const selectedWard = this.wards.find(
            (war: any) => war.id === formValues.wardId
        );
        const districWard = selectedWard ? selectedWard.name : '';

        const address = `${districWard} - ${districName} - ${cityName}`.trim();

        const userInfo = {
            id: this.RoleGroupForm2.value.id,
            name: this.RoleGroupForm2.value.name,
            phoneNumber: this.RoleGroupForm2.value.phoneNumber,
            email: this.RoleGroupForm2.value.email,
            referralCode: this.RoleGroupForm2.value.referralCode,
            address: address,
            password: this.maskPassword(this.passwordHash),
            cityId: this.RoleGroupForm2.value.cityId,
            cityName: cityName,
            districtId: this.RoleGroupForm2.value.districtId,
            districtName: districName,
            wardId: this.RoleGroupForm2.value.wardId,
            wardName: districWard,
        };

        const roleNames = this.RoleGroupForm2.value.roles
            .map((roleId: number) => {
                const role = this.Roles2.find((r: any) => r.value === roleId);
                return role ? role.normalizedName : null; // Use normalizedName instead of label
            })
            .filter((roleName: string) => roleName !== null);

        const assignRolesData = {
            userId: this.RoleGroupForm2.value.id,
            roleNames: roleNames, // Now uses normalizedName
        };

        try {
            this.savingInProgress = true;
            this.usersService.updateUser(userInfo).subscribe(
                (updateResponse) => {
                    console.log(
                        'Cập nhật thông tin người dùng thành công:',
                        updateResponse
                    );
                    this.usersService
                        .assignRolesToUser(assignRolesData)
                        .subscribe(
                            (RoleResponse) => {
                                console.log(
                                    'Gán nhóm quyền thành công:',
                                    RoleResponse
                                );

                                this.messages = [
                                    {
                                        severity: 'success',
                                        summary: 'Thành công',
                                        detail: 'Tài khoản đã được cập nhật thành công',
                                        life: 3000,
                                    },
                                ];
                                this.RoleGroupForm2.reset();
                                this.closeDialog2();
                            },
                            (error) => {
                                // console.error('Lỗi khi gán nhóm quyền:', error);
                                this.messages = [
                                    {
                                        severity: 'error',
                                        summary: '',
                                        detail: 'Lỗi khi gán nhóm quyền',
                                        life: 3000,
                                    },
                                ];
                            }
                        );
                },
                (error) => {
                    // console.error('Lỗi khi cập nhật:', error);
                    this.messages = [
                        {
                            severity: 'error',
                            summary: '',
                            detail: 'Lỗi khi cập nhật:',
                            life: 3000,
                        },
                    ];
                }
            );
        } catch (error) {
            this.messages = [
                {
                    severity: 'error',
                    summary: 'Không thể lưu vì:',
                    detail: 'Thông tin đang có lỗi cần được chỉnh sửa',
                    life: 3000,
                },
            ];
            // this.openDialog2(this.employessId2);
            this.Filters();
        } finally {
            this.savingInProgress = false;
        }
    }

    // onLockAccountChange(event: any): void {
    //     const checked = event.checked ?? event.value ?? event;
    //     this.RoleGroupForm2.get('lockoutEnabled')?.setValue(checked);
    //     const updatedStatus = this.RoleGroupForm2.get('lockoutEnabled')?.value;
    //     if (updatedStatus == true){

    //         this.messageService.add({
    //             severity: 'success',
    //             summary: 'Thành công',
    //             detail: 'Tài khoản đã được mở khóa',
    //         });
    //     }
    //     else{
    //         this.messageService.add({
    //             severity: 'success',
    //             summary: 'Thành công',
    //             detail: 'Tài khoản đã bị khóa ',
    //         });
    //     }
    //     this.updateAccountStatus(this.employessId2, !updatedStatus);
    // }
    onLockAccountChange(event: any): void {
        const checked = event.checked ?? event.value ?? event;
        // Chỉ cập nhật giá trị trong FormControl mà không gọi updateAccountStatus
        this.RoleGroupForm2.get('lockoutEnabled')?.setValue(checked);

        // Log giá trị cập nhật để kiểm tra
        const updatedStatus = this.RoleGroupForm2.get('lockoutEnabled')?.value;
        // if (updatedStatus == true) {
        //     this.messageService.add({
        //         severity: 'success',
        //         summary: 'Thành công',
        //         detail: 'Tài khoản đã được mở khóa, nhấn lưu để lưu trạng thái',
        //     });
        // } else {
        //     this.messageService.add({
        //         severity: 'success',
        //         summary: 'Thành công',
        //         detail: 'Tài khoản đã bị khóa, nhấn lưu để lưu trạng thái ',
        //     });
        // }

        this.updateAccountStatus(this.employessId2, !updatedStatus);
        this.RoleGroupForm2.get('lockoutEnabled')?.setValue(checked);

        if (updatedStatus == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Thông báo',
                detail: 'Tài khoản đã được mở khóa',
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Thông báo',
                detail: 'Tài khoản đã bị khóa ',
            });
        }
    }

    updateAccountStatus(userId: number, lockoutEnabled: boolean): void {
        const data = {
            userId: userId,
            isLock: lockoutEnabled,
        };
        // console.log('Update data:', data);
        this.usersService.updateStatusAccount(data).subscribe();
    }
    // onSave(): void {
    //     const isLocked = this.RoleGroupForm2.get('lockoutEnabled')?.value;

    //     if (isLocked !== null && isLocked !== undefined) {
    //         this.updateAccountStatus(this.employessId2, !isLocked);
    //         this.messageService.add({
    //             severity: 'success',
    //             summary: 'Thành công',
    //             detail: 'Cập nhật trạng thái tài khoản thành công',
    //         });
    //     } else {
    //     }
    // }
    onSave(): void {
        const isLocked = this.RoleGroupForm2.get('lockoutEnabled')?.value;

        if (this.employessId2 === 1) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể cập nhật tài khoản với ID này.',
            });
            return;
        }

        if (isLocked !== null && isLocked !== undefined) {
            this.updateAccountStatus(this.employessId2, !isLocked);
            this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Cập nhật trạng thái tài khoản thành công',
            });
        } else {
            console.error('Không thể lấy giá trị lockoutEnabled');
        }
    }
}
