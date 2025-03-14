import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng/api';
import { HttpLoadingService } from 'src/app/core/https/http-loading.service';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-tree-binary',
    templateUrl: './tree-binary.component.html',
    styleUrl: './tree-binary.component.scss',
})
export class TreeBinaryComponent {
    ImgUrl: string = environment.baseApiImageUrl;
    data: any[] = [];
    users: any[] = [];
    selectedUserId: number | null = null;
    items: MenuItem[] | undefined;
    zoomScale: number = 1;
    isDragging = false;
    startX = 0;
    startY = 0;
    scrollLeft = 0;
    scrollTop = 0;
    downLevels = Array.from({ length: 21 }, (_, i) => ({
        label: (i + 1).toString(),
        value: i + 1,
    }));

    selectedDownLevel: number;
    messages: any[] = [];
    filteredUsers: any[] = [];
    selectedUser: any;
    isFixed: boolean = false;
    showConfirmDialog: boolean = false; // Trạng thái hiển thị dialog
    userToDelete: any = null; 

    constructor(private treeDataService: OrganizationService) { }

    ngOnInit() {
        this.items = [
            { icon: 'pi pi-home', route: '/installation' },
            { label: 'Hệ thống' },
            { label: 'Phân cấp người dùng' },
        ];
        this.getUsers();
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        // Adjust the threshold as needed
        const scrollThreshold = 200;
        this.isFixed = window.pageYOffset > scrollThreshold;
    }

    filterUserSuggestions(event: any): void {
        this.getUsers();
        const query = event.query.toLowerCase();
        this.filteredUsers = this.users.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.phoneNumber.toLowerCase().includes(query)
        );
    }

    getUsers(): void {
        const request: any = {
            pageSize: 30,
            pageIndex: 1,
        };
        this.treeDataService.getDropdownData(request).subscribe(
            (response: any) => {
                if (response.status) {
                    // Format users to include both name and phoneNumber in display label
                    this.users = response.data.items.map((user) => ({
                        ...user,
                        displayLabel: `${user.name} - ${user.phoneNumber}`, // Custom display label
                    }));
                }
            },
            (error) => {
                console.error('Error fetching users:', error);
            }
        );
    }

    searchUsers(event: any) {
        const query = event.query;

        const request: any = {
            pageSize: 20000000,
            pageIndex: 1,
        };

        this.treeDataService.getDropdownData(request).subscribe((response: any) => {
            const users = response.data.items;

            this.filteredUsers = users
                .filter((user: any) =>
                    (user.name && user.name.toLowerCase().includes(query.toLowerCase())) ||
                    (user.phoneNumber && user.phoneNumber.includes(query))
                )
                .map((user: any) => ({
                    ...user,
                    displayText: `${user.name} - ${user.phoneNumber || ''}`.trim(), // Gộp name và phoneNumber
                }));
        });
    }

    zoomIn() {
        this.zoomScale += 0.1; // Adjust the increment as needed
    }

    // Hàm thu nhỏ (nếu bạn muốn thêm chức năng thu nhỏ)
    zoomOut() {
        const zoomOutStep = 0.1; // Customize this value to control zoom-out speed
        this.zoomScale = Math.max(0.5, this.zoomScale - zoomOutStep);
    }

    loadData() {
        if (this.selectedUser && this.selectedDownLevel !== undefined) {
            this.filterData();
            this.messages = [
                {
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Dữ liệu đã được cập nhật',
                    life: 1000,
                },
            ];
        } else {
            this.messages = [
                {
                    severity: 'warn',
                    summary: '',
                    detail: 'Bạn chưa chọn người dùng hoặc cấp độ',
                    life: 3000,
                },
            ];
        }
    }

    filterData(): void {
        if (this.selectedUser && this.selectedDownLevel !== undefined) {
            this.selectedUserId = this.selectedUser.id; // Ensure user ID is set based on the selected user
            this.treeDataService
                .getTreeData(this.selectedUserId, this.selectedDownLevel)
                .subscribe(
                    (response: any) => {
                        if (response.status) {
                            this.data = [
                                this.transformToChartData(response.data),
                            ];
                        }
                    },
                    (error) => {
                        console.error('Error fetching tree data:', error);
                    }
                );
        } else {
            this.messages = [
                {
                    severity: 'warn',
                    summary: '',
                    detail: 'Bạn chưa chọn người dùng hoặc cấp độ',
                    life: 3000,
                },
            ];
        }
    }

    onDownLevelChange(event: any): void {
        console.log('DownLevel changed:', event.value);
        this.selectedDownLevel = event.value; // Ensure selectedDownLevel gets updated
    }

    openDeleteDialog(person: any): void {
        this.userToDelete = person;
        this.showConfirmDialog = true;
    }

    openDeleteDialog2(child: any): void {
        this.userToDelete = child;
        this.showConfirmDialog = true;
    }

    // Hủy xóa
    onCancel(): void {
        this.userToDelete = null;
        this.showConfirmDialog = false;
    }

    // Hàm để chuyển đổi dữ liệu JSON từ API thành cấu trúc cho p-organizationChart
    transformToChartData(node: any, currentLevel: number = 1): any {
        if (currentLevel > 21) {
            return null;
        }

        // Map and filter the children as before
        const children =
            node.children
                ?.map((child: any) =>
                    this.transformToChartData(child, currentLevel + 1)
                )
                .filter((child: any) => child !== null) || [];

        const sortedChildren = children.sort((a: any, b: any) => {
            if (a.position === 'left' && b.position === 'right') {
                return -1;
            } else if (a.position === 'right' && b.position === 'left') {
                return 1;
            }
            return 0;
        });

        return {
            name: node.user.name,
            avatarUrl: node.user.avatarUrl,
            level: node.level,
            userId: node.userId,
            totalCombos: node.totalCombos,
            position: node.position,
            isManager: node.isManager,
            managerInfo: node.isManager ? 'Quản Lý' : '',
            children: sortedChildren.length ? sortedChildren : [],
        };
    }

    removeNodeById(nodes: any[], userId: number): any[] {
        return nodes
            .map((node) => ({
                ...node,
                children: this.removeNodeById(node.children || [], userId),
            }))
            .filter((node) => node.userId !== userId);
    }


    onConfirmDelete(): void {
        const userId = this.userToDelete.userId;
        // const request  = { id: userId };

        this.treeDataService.deleteNode(userId).subscribe(
            (response: any) => {
                if (response && response.status) {
                    // Xóa node từ dữ liệu cây
                    this.data = this.removeNodeById(this.data, userId);
                    this.messages = [
                        {
                            severity: 'success',
                            summary: 'Thành công',
                            detail: 'Xóa thành công',
                            life: 3000,
                        },
                    ];
                } else {
                    const errorMessage = response?.message
                    this.messages = [
                        {
                            severity: 'error',
                            summary: 'Lỗi',
                            detail: errorMessage,
                            life: 3000,
                        },
                    ];
                }
                this.showConfirmDialog = false;
                this.userToDelete = null;
            },
            (error) => {
                this.messages = [
                    {
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Có lỗi xảy ra khi xóa node',
                        life: 3000,
                    },
                ];
                console.error('Error deleting node:', error);
                this.showConfirmDialog = false;
            }
        );
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


    //add user to Tree
    isSubmit = false;
    showAddUserToTree = false;

    selectedUserJoin: any;

    selectedUserInvite: any;


    handleShowAddUserToTree() {
        this.showAddUserToTree = true;
    }

    handleAddUserToTree() {
        if (this.isSubmit == false) {
            if (this.selectedUserJoin == null || this.selectedUserJoin == undefined || this.selectedUserJoin.id == undefined || this.selectedUserJoin.id == null) {
                this.messages = [
                    {
                        severity: 'warn',
                        summary: '',
                        detail: 'Bạn chưa chọn người vào cây',
                        life: 3000,
                    },
                ];
            }
            else {
                this.isSubmit = true;
                const request = {
                    userId: this.selectedUserJoin.id,
                    inviterId: this.selectedUserInvite?.id != undefined ? this.selectedUserInvite?.id : null
                }
                console.log(request);
                this.treeDataService.addUserToTree(request).subscribe(res => {
                    this.isSubmit = false;
                    if (res.status == true) {
                        this.messages = [
                            {
                                severity: 'success',
                                summary: '',
                                detail: 'Thành công',
                                life: 3000,
                            },
                        ];
                        // this.filterData();
                    }
                    else {
                        this.messages = [
                            {
                                severity: 'warn',
                                summary: '',
                                detail: res.message,
                                life: 3000,
                            },
                        ];
                    }
                }, err => {
                    this.isSubmit = false;
                    this.messages = [
                        {
                            severity: 'error',
                            summary: '',
                            detail: 'Lỗi hệ thống',
                            life: 3000,
                        },
                    ];
                })
            }
        }


    }
}
