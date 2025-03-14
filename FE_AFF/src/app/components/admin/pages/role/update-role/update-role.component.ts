import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { PermissionItemComponent } from './permission-item/permission-item.component';

@Component({
    selector: 'app-update-role',
    standalone: true,
    imports: [TreeModule, CommonModule, PermissionItemComponent],
    templateUrl: './update-role.component.html',
    styleUrl: './update-role.component.scss',
})
export class UpdateRoleComponent implements OnInit {
    selectedPermissions: any[] = [];

    ngOnInit(): void {
        this.getPermissionIds(this.rolePermissions.data.permissions);
    }

    permissions = [
        {
            id: 7,
            name: 'Admin',
            displayName: 'Admin',
            parentPermissionId: null,
            description: 'Admin',
            childrens: [
                {
                    id: 11,
                    name: 'Admin3',
                    displayName: 'Admin3',
                    parentPermissionId: 7,
                    description: 'Admin3',
                    childrens: [],
                },
            ],
        },
        {
            id: 15,
            name: 'Team IT',
            displayName: 'Team IT',
            parentPermissionId: null,
            description: 'Team IT',
            childrens: [
                {
                    id: 17,
                    name: 'Maketing',
                    displayName: 'Maketing',
                    parentPermissionId: 15,
                    description: 'Maketing',
                    childrens: [
                        {
                            id: 18,
                            name: 'Design',
                            displayName: 'Design',
                            parentPermissionId: 17,
                            description: 'Design',
                            childrens: [],
                        },
                    ],
                },
            ],
        },
    ];

    permissionsTree = [
        {
            id: 7,
            name: 'Admin',
            displayName: 'Admin',
            parentPermissionId: null,
            description: 'Admin',
            childrens: [
                {
                    id: 11,
                    name: 'Admin3',
                    displayName: 'Admin3',
                    parentPermissionId: 7,
                    description: 'Admin3',
                    childrens: [],
                },
            ],
        },
        {
            id: 15,
            name: 'Team IT',
            displayName: 'Team IT',
            parentPermissionId: null,
            description: 'Team IT',
            childrens: [
                {
                    id: 17,
                    name: 'Maketing',
                    displayName: 'Maketing',
                    parentPermissionId: 15,
                    description: 'Maketing',
                    childrens: [
                        {
                            id: 18,
                            name: 'Design',
                            displayName: 'Design',
                            parentPermissionId: 17,
                            description: 'Design',
                            childrens: [],
                        },
                    ],
                },
            ],
        },
    ];

    rolePermissions = {
        status: true,
        message: 'Lấy thông tin vai trò thành công!',
        data: {
            id: 35,
            name: 'adasdasda',
            description: null,
            permissions: [
                {
                    id: 7,
                    name: 'Admin',
                    displayName: 'Admin',
                    parentPermissionId: null,
                    description: 'Admin',
                    childrens: [
                        {
                            id: 11,
                            name: 'Admin3',
                            displayName: 'Admin3',
                            parentPermissionId: 7,
                            description: 'Admin3',
                            childrens: [],
                        },
                    ],
                },
            ],
        },
    };

    allPermissions = {
        status: true,
        message: 'Lấy thông tin danh quyền thành công thành công!',
        data: {
            // "items": [
            // 	// Include your full permission items here
            // ]
            items: [
                {
                    id: 16,
                    name: 'Maketing',
                    displayName: ' kinh tế ',
                    parentPermissionId: null,
                    description: 'kinh tế',
                    childrens: [],
                },
                {
                    id: 15,
                    name: 'Team IT',
                    displayName: 'team giải quyết vấn đề công nghệ ',
                    parentPermissionId: null,
                    description: 'phần mềm',
                    childrens: [
                        {
                            id: 17,
                            name: 'Maketing',
                            displayName: ' kinh tế ',
                            parentPermissionId: 15,
                            description: 'kinh tế',
                            childrens: [
                                {
                                    id: 18,
                                    name: 'Design',
                                    displayName: ' Design',
                                    parentPermissionId: 17,
                                    description: 'Thiết kế',
                                    childrens: [],
                                },
                                {
                                    id: 19,
                                    name: 'TK1',
                                    displayName: 'Thiết kế thời trang',
                                    parentPermissionId: 17,
                                    description: 'thiết kế phiên bản 1',
                                    childrens: [],
                                },
                            ],
                        },
                        {
                            id: 20,
                            name: 'Kinh Tế',
                            displayName: 'digital MKT',
                            parentPermissionId: 15,
                            description: 'Xuất-nhập khẩu',
                            childrens: [],
                        },
                    ],
                },
                {
                    id: 14,
                    name: 'Master',
                    displayName: 'Master',
                    parentPermissionId: null,
                    description: 'Master',
                    childrens: [],
                },
                {
                    id: 8,
                    name: 'Admin2',
                    displayName: 'Admin2',
                    parentPermissionId: null,
                    description: 'Admin2',
                    childrens: [],
                },
                {
                    id: 7,
                    name: 'Admin',
                    displayName: 'Admin',
                    parentPermissionId: null,
                    description: 'Admin',
                    childrens: [
                        {
                            id: 11,
                            name: 'Admin3',
                            displayName: 'Admin3',
                            parentPermissionId: 7,
                            description: 'Admin3',
                            childrens: [],
                        },
                    ],
                },
                {
                    id: 2,
                    name: 'nguyenvanthang',
                    displayName: 'Nguyễn Văn Thắng',
                    parentPermissionId: null,
                    description: 'Nguyễn Văn Thắng',
                    childrens: [
                        {
                            id: 3,
                            name: 'nguyenvanthang_con1',
                            displayName: 'Nguyễn Văn Thắng con 1',
                            parentPermissionId: 2,
                            description: 'Nguyễn Văn Thắng',
                            childrens: [],
                        },
                        {
                            id: 4,
                            name: 'nguyenvanthang_con2',
                            displayName: 'Nguyễn Văn Thắng con 2',
                            parentPermissionId: 2,
                            description: 'Nguyễn Văn Thắng',
                            childrens: [],
                        },
                    ],
                },
                {
                    id: 1,
                    name: 'thangtnynguyen',
                    displayName: 'Thắng Tny Nguyễn',
                    parentPermissionId: null,
                    description: 'Thắng Tny Nguyễn',
                    childrens: [],
                },
            ],
        },
    };

    getPermissionIds(permissions: any[]) {
        permissions.forEach((permission) => {
            this.selectedPermissions.push(permission.id); // Thêm id của permission cha
            if (permission.childrens && permission.childrens.length > 0) {
                this.getPermissionIds(permission.childrens); // Gọi đệ quy để lấy id của permission con
            }
        });
    }

    // Gọi hàm với permissions từ rolePermissions
}
