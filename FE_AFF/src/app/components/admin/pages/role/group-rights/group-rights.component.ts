import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OptionsFilterCommodities } from 'src/app/core/models/option-filter-commodities';
import { RoleService } from 'src/app/core/services/role.service';
import { MenuItem, TreeNode } from 'primeng/api';
import { PermissionService } from 'src/app/core/services/permission.service';
import { PermissionConstants } from 'src/app/core/models/permissions';
import { AuthService } from 'src/app/core/services/identity/auth.service';

@Component({
    selector: 'app-group-rights',
    templateUrl: './group-rights.component.html',
    styleUrl: './group-rights.component.scss',
})
export class GroupRightsComponent implements OnInit {
    permissions: any[] = [];
    permissionsById2: any[] = [];
    selectedPermissions: any[] = [];
    roles: any[] = [];
    pageIndex: number = 1;
    pageSize: number = 30;
    WordSearch: string = '';
    totalRecordsCount: number = 0;
    name: string = '';
    maxLength: number = 100;
    totalRecords: number = 0;
    groupRoleById!: any;
    groupRoleId: any;
    currentPageReport: string = '';
    selectedName!: string;
    showDialog = false;
    showDialog2 = false;
    messages!: any[];
    RoleGroupForm!: FormGroup;
    RoleGroupForm2!: FormGroup;
    savingInProgress = false;
    isSubmitting: boolean = false;
    showNameError: boolean = false;
    showNameError2: boolean = false;
    showNameError3: boolean = false;
    PageIndex: number = 1;
    PageSize: number = 30;
    PageIndex2: number = 1;
    PageSize2: number = 1000;
    showFullDescription: boolean = false;
    selectedPermissionIds: number[] = [];
    expandedItems: Set<number> = new Set();
    permissionsTree: any = [];
    items: MenuItem[] | undefined;

    optionsFilterCommodities: OptionsFilterCommodities =
        new OptionsFilterCommodities();

    constructor(
        private router: Router,
        private roleService: RoleService,
        private permissionService: PermissionService,
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
            description: [
                '',
                [Validators.required, this.noWhitespaceValidator],
            ],
            permissionIds: [[], Validators.required],
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
            description: [
                '',
                [Validators.required, this.noWhitespaceValidator],
            ],
            // permissionIds: [[], Validators.required],
            // selectedPermissionIds: [[], Validators.required],
        });
    }

    ngOnInit() {
        this.items = [
            { icon: 'pi pi-home', route: '/installation' },
            { label: 'Quản trị hệ thống' },
            { label: 'Nhóm quyền' },
        ];
        this.Filters();
        this.getAllFilterRole();
        // this.getAllFilterRole2();
    }

    noWhitespaceValidator(control: any) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { whitespace: true };
    }

    validatePermissions(): boolean {
        return this.selectedPermissionIds.length > 0;
    }

    truncateDescription(
        description: string,
        limit: number,
        showFull: boolean
    ): string {
        if (!description) {
            return ''; // Trả về chuỗi rỗng nếu description không có dữ liệu
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(description, 'text/html');
        const plainText = doc.body.textContent || ''; // Xử lý nếu không có nội dung text

        if (plainText.length > limit && !showFull) {
            return plainText.substring(0, limit) + '...';
        }
        return plainText;
    }

    getAllFilterRole(): void {
        const request: any = {
            pageSize: this.PageSize2,
            pageIndex: this.PageIndex2,
        };
        this.permissionService
            .getPermissionAll(request)
            .subscribe((response: any) => {
                this.permissions = this.formatPermissions(response.data.items);
                this.permissionsTree = response.data.items;
            });
    }

    getAllFilterRole2(): void {
        const request: any = {
            pageSize: this.PageIndex2,
            pageIndex: this.PageIndex2,
        };
        this.permissionService
            .getPermissionAll(request)
            .subscribe((response: any) => {
                this.permissionsById2 = this.transformToTreeNodes(
                    response.data.items
                );

                console.log(this.permissionsById2);

                console.log(this.permissionsById2);
            });
    }

    transformToTreeNodes(permissions: any[]): any[] {
        return permissions.map((permission) => ({
            label: permission.displayName,
            id: permission.id,
            children: this.transformToTreeNodes(permission.childrens || []),
        }));
    }

    formatPermissions(items: any[], parent: any = null): any[] {
        return items.map((item) => {
            const formattedItem = {
                label: item.displayName,
                data: item.name,
                id: item.id,
                parent: parent, // Set parent reference
                children: this.formatPermissions(item.childrens, item),
            };
            return formattedItem;
        });
    }

    onNodeSelect(event: any) {
        this.selectParentNode(event.node);
        this.updatePartialSelection(event.node);
    }

    onNodeUnselect(event: any) {
        this.unselectChildNodes(event.node);
        this.updatePartialSelection(event.node);
    }

    // Recursively select parent nodes only if they are not already selected
    selectParentNode(node: any) {
        const selectedPermissions =
            this.RoleGroupForm.controls['permissionIds'].value;
        if (node.parent && !selectedPermissions.includes(node.parent)) {
            selectedPermissions.push(node.parent);
            this.RoleGroupForm.controls['permissionIds'].setValue(
                selectedPermissions
            );
            this.selectParentNode(node.parent); // Continue to select the parent
        }
    }

    // Update partial selection state for parents based on child selection
    updatePartialSelection(node: any) {
        if (node.parent) {
            const allChildren = node.parent.children || [];
            const selectedChildren = allChildren.filter((child: any) =>
                this.RoleGroupForm.controls['permissionIds'].value.includes(
                    child
                )
            );

            if (selectedChildren.length === 0) {
                node.parent.partialSelected = false; // No child selected, parent is not selected
            } else if (selectedChildren.length === allChildren.length) {
                node.parent.partialSelected = false; // All children selected, parent fully selected
                this.RoleGroupForm.controls['permissionIds'].value.push(
                    node.parent
                );
            } else {
                node.parent.partialSelected = true; // Some children selected, parent is partially selected
            }

            this.updatePartialSelection(node.parent); // Continue checking up the tree
        }
    }

    // Recursively unselect child nodes if necessary
    unselectChildNodes(node: any) {
        const selectedPermissions =
            this.RoleGroupForm.controls['permissionIds'].value;
        if (node.children && node.children.length > 0) {
            node.children.forEach((child: any) => {
                const index = selectedPermissions.indexOf(child);
                if (index !== -1) {
                    selectedPermissions.splice(index, 1);
                    this.unselectChildNodes(child);
                }
            });
            this.RoleGroupForm.controls['permissionIds'].setValue(
                selectedPermissions
            );
        }
    }

    Filters(): void {
        //debugger
        this.roleService
            .getFiltersRoles(this.pageSize, this.pageIndex, this.name)
            .subscribe(
                (response) => {
                    this.roles = response.data.items;
                    this.totalRecords = response.data.totalRecords;
                    this.updateCurrentPageReport();
                    //console.log(this.users)
                },
                (error) => {
                    console.error('Error fetching filtered customers:', error);
                }
            );
    }

    clickButtonFilter() {
        if (this.selectedName) {
            this.name = this.selectedName?.trim();
            this.pageIndex = 1;
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
            this.name = this.selectedName?.trim();
            this.pageIndex = 1;
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

    onPageChange(event: any): void {
        this.pageIndex = event.page + 1;
        this.pageSize = event.rows;
        this.Filters();
    }

    goToPreviousPage(): void {
        if (this.pageIndex > 1) {
            this.pageIndex--;
            this.Filters();
        }
    }

    goToNextPage(): void {
        const lastPage = Math.ceil(this.totalRecords / this.pageSize);
        if (this.pageIndex < lastPage) {
            this.pageIndex++;
            this.Filters();
        }
    }
    updateCurrentPageReport(): void {
        const startRecord = (this.pageIndex - 1) * this.pageIndex + 1;
        const endRecord = Math.min(
            this.pageIndex * this.pageSize,
            this.totalRecords
        );
        this.currentPageReport = `<strong>${startRecord}</strong> - <strong>${endRecord}</strong> trong <strong>${this.totalRecords}</strong> bản ghi`;
    }

    toggleDescription(role: any): void {
        role.showFullDescription = !role.showFullDescription;
    }

    onInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const trimmedValue = inputElement.value.trim(); // Cắt ký tự khoảng trắng ở hai đầu chuỗi
        this.optionsFilterCommodities.name = trimmedValue;
    }

    openDialog() {
        const userPermissions =
            this.authService.getUserCurrent()?.permissions || [];

        const hasRequiredPermissions = [
            PermissionConstants.ManageRole,
            PermissionConstants.ManageRoleCreate,
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

    openDialog2(Id: number): void {
        const userPermissions =
            this.authService.getUserCurrent()?.permissions || [];

        const hasRequiredPermissions = [
            PermissionConstants.ManageRole,
            PermissionConstants.ManageRoleEdit,
        ].every((permission) => userPermissions.includes(permission));

        const hasRequiredPermissions2 = [
            PermissionConstants.Admin,
            PermissionConstants.Master,
        ].some((permission) => userPermissions.includes(permission));

        if (hasRequiredPermissions || hasRequiredPermissions2) {
            this.selectedPermissionIds = [];
            this.groupRoleId = Id;
            this.getAllFilterRole2();
            this.roleService.getGroupRoleById(Id).subscribe(
                (response: any) => {
                    this.groupRoleById = response.data;
                    this.showDialog2 = true;
                    this.permissionsById2 = this.transformToTreeNodes2(
                        this.groupRoleById.permissions
                    );
                    this.RoleGroupForm2.patchValue({
                        id: this.groupRoleById.id,
                        name: this.groupRoleById.name,
                        description: this.groupRoleById.description,
                        permissionIds: this.permissionsById2,
                    });
                    // console.log(
                    //     this.transformToTreeNodes2(this.groupRoleById.permissions)
                    // );
                    this.getPermissionIds(response.data.permissions);
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

    transformToTreeNodes2(permissions: any[]): any[] {
        return permissions.map((permission) => ({
            label: permission.name,
            data: permission,
            id: permission.id,
            children:
                permission.childrens && permission.childrens.length > 0
                    ? this.transformToTreeNodes2(permission.childrens)
                    : [],
        }));
    }

    get rolesControl() {
        return this.RoleGroupForm.get('permissionIds');
    }

    get rolesControl2() {
        return this.RoleGroupForm2.get('permissionIds');
        // return this.RoleGroupForm2.get('selectedPermissionIds');
    }

    checkRolesSelection() {
        // Kiểm tra nếu trường chưa có giá trị
        if (!this.rolesControl?.value || this.rolesControl.value.length === 0) {
            this.rolesControl.setErrors({ required: true }); // Đặt lỗi required
            this.rolesControl.markAsTouched(); // Đánh dấu trường là touched
        } else {
            this.rolesControl.setErrors(null); // Xóa lỗi nếu đã chọn giá trị
        }
    }

    // checkRolesSelection2() {
    //     // Kiểm tra nếu trường chưa có giá trị
    //     if (
    //         !this.rolesControl2?.value ||
    //         this.rolesControl2.value.length === 0
    //     ) {
    //         this.rolesControl2.setErrors({ required: true }); // Đặt lỗi required
    //         this.rolesControl2.markAsTouched(); // Đánh dấu trường là touched
    //     } else {
    //         this.rolesControl2.setErrors(null); // Xóa lỗi nếu đã chọn giá trị
    //     }
    // }

    closeDialog() {
        this.showDialog = false;
        this.RoleGroupForm.reset();
        this.showNameError = false;
        this.showNameError2 = false;
    }

    closeDialog2() {
        this.showDialog2 = false;
        this.RoleGroupForm2.reset();
        this.showNameError = false;
        this.showNameError2 = false;
    }

    onInputChange(event: any) {
        const input = event.target;
        let trimmedValue = input.value.trim();

        if (trimmedValue.length > this.maxLength) {
            input.value = trimmedValue.substring(0, this.maxLength);
        }
    }

    getErrorMessage() {
        if (this.RoleGroupForm.controls['name'].hasError('required')) {
            return 'Tên nhóm quyền không được để trống';
        }
        return 'Tên nhóm quyền không được chứa toàn ký tự trắng';
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

        if (!formValues.name || formValues.name.length === 0) {
            this.showNameError = true;
            hasError = true;
        }

        // if (!formValues.description || formValues.description.length === 0) {
        //   this.showNameError2 = true;
        //   hasError = true;
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

            const selectedPermissions =
                this.RoleGroupForm.value.permissionIds.map(
                    (item: any) => item.id
                );

            const roleData = {
                name: formValues.name,
                description: formValues.description,
                permissionIds: selectedPermissions, // Lấy tên của các nhóm quyền
            };

            // Gửi yêu cầu tới API để thêm người dùng
            this.roleService.createRoles(roleData).subscribe(
                (response) => {
                    console.log('Nhóm quyền đã được tạo thành công', response);
                    this.messages = [
                        {
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Nhóm quyền đã được thêm thành công',
                            life: 3000,
                        },
                    ];
                    this.closeDialog(); // Đóng dialog sau khi thêm thành công
                    this.Filters();
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

    async onSubmitUpdate() {
        if (this.savingInProgress) {
            return;
        }

        this.isSubmitting = true;
        const formValue = this.RoleGroupForm2.value;

        let hasError = false;

        if (!this.validatePermissions()) {
            this.showNameError3 = true;
            hasError = true;
        }

        // if (
        //     !this.rolesControl2?.value ||
        //     this.rolesControl2.value.length === 0
        // ) {
        //     this.rolesControl2.setErrors({ required: true }); // Đặt lỗi required
        //     this.rolesControl2.markAsTouched(); // Đánh dấu trường là touched
        //     hasError = true;
        // } else {
        //     this.rolesControl2.setErrors(null); // Xóa lỗi nếu đã chọn giá trị
        // }

        if (!formValue.name || formValue.name.length === 0) {
            this.showNameError = true;
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
        try {
            this.savingInProgress = true;
            // const permissionIds = formValue.permissionIds.map(
            //     (permission) => permission.id
            // );
            const permissionIds = this.selectedPermissionIds;

            const payload = {
                id: this.groupRoleById.id || 0, // Use existing id if editing, 0 if creating new
                name: formValue.name,
                description: formValue.description,
                permissionIds: permissionIds,
            };
            // console.log('haha'+permissionIds);
            // Gửi yêu cầu tới API để thêm người dùng
            this.roleService.saveGroupRole(payload).subscribe(
                (response) => {
                    console.log(
                        'Nhóm quyền đã được cập nhật thành công',
                        response
                    );
                    this.messages = [
                        {
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Nhóm quyền đã được cập nhật thành công',
                            life: 3000,
                        },
                    ];
                    this.permissionsById2 = [];
                    this.closeDialog2(); // Đóng dialog sau khi thêm thành công
                    this.Filters();
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

    getPermissionIds(permissions: any[]) {
        permissions.forEach((permission) => {
            this.selectedPermissionIds.push(permission.id);
            if (permission.childrens && permission.childrens.length > 0) {
                this.getPermissionIds(permission.childrens);
            }
        });
    }
    onPermissionsChange(updatedPermissions: any[]) {
        // console.log("change nhe" +updatedPermissions);

        this.selectedPermissionIds = updatedPermissions;
    }
}
