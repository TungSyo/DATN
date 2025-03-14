import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { AuthService } from '../../core/services/identity/auth.service';
import { RefreshTokenService } from '../../core/signlrs/refresh-token.service';
import { MessageService } from 'primeng/api';
import { el } from '@fullcalendar/core/internal-common';
import { PermissionConstants } from 'src/app/core/models/permissions';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    providers: [MessageService],
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];
    authToken: any = null;
    userCurrent: any;
    private isRefreshing: boolean = false;
    constructor(
        public layoutService: LayoutService,
        private refreshTokenService: RefreshTokenService,
        private authService: AuthService,
        private messageService: MessageService
    ) {
        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
            // console.log(this.userCurrent);
        });
    }

    ngOnInit() {
        // console.log("ssssssssssss");
        this.refreshTokenService.startConnection();
        this.refreshTokenService.addActivityListener((activity) => {
            if (activity != null && activity.id == this.userCurrent.id) {
                console.log('đổi nhóm quyền');
                this.authToken = this.authService.getAuthTokenLocalStorage();
                this.authService
                    .refreshToken({
                        refreshToken: this.authToken.refreshToken,
                    })
                    .subscribe((res) => {
                        if (res.status == true) {
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Cảnh báo',
                                detail: 'Bạn đã bị thay đổi quyền',
                            });

                            this.authService.setAuthTokenLocalStorage(res.data);
                            this.authService
                                .fetchUserCurrent()
                                .subscribe((res) => {
                                    this.authService.setUserCurrent(res.data);
                                });
                        }
                    });
            }
        });
        this.refreshTokenService.addActivityChangeRoleListener((activity) => {
            console.log('đổi quyền');
            // console.log(this.userCurrent.roleNames);
            // console.log("Mhóm quyền"+JSON.stringify(activity));
            // console.log("Các nhóm quyền"+this.userCurrent.roleNames);
            // console.log('ket qua  ' + this.userCurrent.roleNames.includes(activity.normalizedName));
            if (
                !this.isRefreshing &&
                activity != null &&
                this.userCurrent.roleNames.includes(activity.normalizedName)
            ) {
                // console.log(this.authToken);
                this.isRefreshing = true;
                this.authToken = this.authService.getAuthTokenLocalStorage();
                this.authService
                    .refreshToken({
                        refreshToken: this.authToken.refreshToken,
                    })
                    .subscribe(
                        (res) => {
                            this.isRefreshing = false; // Đặt lại cờ sau khi hoàn thành
                            if (res.status == true) {
                                // console.log("đổi quyền đúng");
                                this.messageService.add({
                                    severity: 'warn',
                                    summary: 'Cảnh báo',
                                    detail: 'Bạn đã bị thay đổi quyền',
                                    life: 2500,
                                });

                                this.authService.setAuthTokenLocalStorage(
                                    res.data
                                );
                                this.authService
                                    .fetchUserCurrent()
                                    .subscribe((res) => {
                                        this.authService.setUserCurrent(
                                            res.data
                                        );
                                    });
                            } else {
                                // console.log("đổi quyền sai");
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Cảnh báo',
                                    detail: 'Bạn cần đăng xuất để cập nhập quyền',
                                    life: 3000,
                                });
                            }
                        },
                        (error) => {
                            this.isRefreshing = false;
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Lỗi',
                                detail: 'Bạn cần đăng xuất để cập nhập quyền',
                                life: 3000,
                            });
                        }
                    );
            }
        });
        const hasPermissions = (permissions: string[]) => {
            const userPermissions =
                this.authService.getUserCurrent()?.permissions || [];
            return permissions.every((permission) =>
                userPermissions.includes(permission)
            );
        };

        const hasPermissionMain = (permission: string) => {
            const userPermissions =
                this.authService.getUserCurrent()?.permissions || [];
            return userPermissions.includes(permission);
        };

        const currentUser = this.authService.getUserCurrent();
        const permissions = currentUser?.permissions;

        const hasAdminOrMasterRole =
            permissions.includes(PermissionConstants.Admin) ||
            permissions.includes(PermissionConstants.Master);
        const hasProductPermissions =
            permissions.includes(PermissionConstants.ManageProduct) &&
            permissions.includes(PermissionConstants.ManageProductView);
        const hasProductCategoryPermissions =
            permissions.includes(PermissionConstants.ManageProductCategory) &&
            permissions.includes(PermissionConstants.ManageProductCategoryView);
        const hasBrandPermissions =
            permissions.includes(PermissionConstants.ManageBrand) &&
            permissions.includes(PermissionConstants.ManageBrandView);
        const hasRolePermissions =
            permissions.includes(PermissionConstants.ManageRole) &&
            permissions.includes(PermissionConstants.ManageRoleView);
        const hasUserPermissions =
            permissions.includes(PermissionConstants.ManageUser) &&
            permissions.includes(PermissionConstants.ManageUserView);
        const hasTreePermissions = permissions.includes(
            PermissionConstants.ManageTree
        );
        const hasNewsPermissions =
            permissions.includes(PermissionConstants.ManageNews) &&
            permissions.includes(PermissionConstants.ManageNewsView);
        this.model = [
            {
                label: '',
                items: [
                    {
                        label: 'Tổng quan',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/admin/dashboard'],
                    },
                ],
            },
            {
                label: '',
                items: [
                    hasAdminOrMasterRole ||
                    hasProductPermissions ||
                    hasProductCategoryPermissions ||
                    hasBrandPermissions
                        ? {
                              label: 'Sản phẩm',
                              icon: 'pi pi-fw pi-box',
                              items: [
                                  hasProductPermissions || hasAdminOrMasterRole
                                      ? {
                                            label: 'Danh sách sản phẩm',
                                            icon: 'pi pi-fw pi-box',
                                            routerLink: [
                                                '/admin/pages/products/show-product',
                                            ],
                                        }
                                      : null,
                                  hasProductCategoryPermissions ||
                                  hasAdminOrMasterRole
                                      ? {
                                            label: 'Danh mục sản phẩm',
                                            icon: 'pi pi-fw pi-tags',
                                            routerLink: [
                                                '/admin/pages/product-category/show',
                                            ],
                                        }
                                      : null,
                                  hasBrandPermissions || hasAdminOrMasterRole
                                      ? {
                                            label: 'Thương hiệu',
                                            icon: 'pi pi-fw pi-tags',
                                            routerLink: [
                                                '/admin/pages/brand/show-brand',
                                            ],
                                        }
                                      : null,
                              ].filter((item) => item !== null),
                          }
                        : null,
                ].filter((item) => item !== null),
            },
            {
                label: '',
                items: [
                    hasAdminOrMasterRole ||
                    hasRolePermissions ||
                    hasUserPermissions
                        ? {
                              label: 'Quản trị hệ thống',
                              icon: 'pi pi-fw pi-users',
                              items: [
                                  hasRolePermissions || hasAdminOrMasterRole
                                      ? {
                                            label: 'Nhóm quyền',
                                            icon: 'pi pi-fw pi-circle',
                                            routerLink: [
                                                '/admin/pages/role/show-role',
                                            ],
                                        }
                                      : null,
                                  hasUserPermissions || hasAdminOrMasterRole
                                      ? {
                                            label: 'Quản lý tài khoản',
                                            icon: 'pi pi-fw pi-circle',
                                            routerLink: [
                                                '/admin/pages/user/show-user',
                                            ],
                                        }
                                      : null,
                                  {
                                      label: 'Tài khoản người dùng',
                                      icon: 'pi pi-fw pi-circle',
                                      routerLink: ['/admin/pages/account-user'],
                                  },
                              ].filter((item) => item !== null),
                          }
                        : null,
                ].filter((item) => item !== null),
            },

            // Công thương
            {
                label: '',
                items: [
                    hasTreePermissions || hasAdminOrMasterRole
                        ? {
                              label: 'Hệ thống',
                              icon: 'pi pi-sitemap',
                              items: [
                                  hasTreePermissions || hasAdminOrMasterRole
                                      ? {
                                            label: 'Phân cấp người dùng',
                                            icon: 'pi pi-fw pi-circle',
                                            routerLink: [
                                                '/admin/pages/tree-binary/show',
                                            ],
                                        }
                                      : null,
                                  // {
                                  //     label: 'Quản lý tài khoản',
                                  //     icon: 'pi pi-fw pi-circle',
                                  //     routerLink: ['/admin/pages/user/show-user'],
                                  // },
                              ].filter((item) => item !== null),
                          }
                        : null,
                ].filter((item) => item !== null),
            },
            {
                label: '',
                items: [
                    {
                        label: 'Rút điểm thưởng',
                        icon: 'pi pi-sitemap',
                        items: [
                            {
                                label: 'Danh sách rút điểm thưởng',
                                icon: 'pi pi-fw pi-circle',
                                routerLink: ['/admin/pages/withdraw'],
                            },
                            {
                                label: 'Hoa hồng điểm thưởng',
                                icon: 'pi pi-fw pi-circle',
                                routerLink: ['/admin/pages/history-amount'],
                            },
                            {
                                label: 'Danh sách hoa hồng tài khoản',
                                icon: 'pi pi-fw pi-circle',
                                routerLink: ['/admin/pages/list-commissions-account'],
                            },
                        ],
                    },
                ],
            },
            {
                label: '',
                items: [
                    {
                        label: 'Đơn hàng',
                        icon: 'pi pi-sitemap',
                        items: [
                            {
                                label: 'Tạo đơn hàng',
                                icon: 'pi pi-fw pi-circle',
                                routerLink: [
                                    '/admin/pages/payments/create-payment',
                                ],
                            },
                            {
                                label: 'Lịch sử đặt hàng',
                                icon: 'pi pi-fw pi-circle',
                                routerLink: [
                                    '/admin/pages/order/order-history',
                                ],
                            },
                            {
                                label: 'Danh sách đơn hàng',
                                icon: 'pi pi-fw pi-circle',
                                routerLink: [
                                    '/admin/pages/payments/show-payments',
                                ],
                            },
                            // {
                            //     label: 'Quản lý tài khoản',
                            //     icon: 'pi pi-fw pi-circle',
                            //     routerLink: ['/admin/pages/user/show-user'],
                            // },
                        ],
                    },
                    hasAdminOrMasterRole || hasNewsPermissions
                        ? {
                              label: 'Quản trị nội dung',
                              icon: 'pi pi-fw pi-users',
                              items: [
                                  //   hasAdminOrMasterRole
                                  //       ? {
                                  //             label: 'Quản lý banner',
                                  //             icon: 'pi pi-fw pi-circle',
                                  //             routerLink: ['/admin/pages/banner'],
                                  //         }
                                  //       : null,
                                  hasNewsPermissions || hasAdminOrMasterRole
                                      ? {
                                            label: 'Quản lý tin tức',
                                            icon: 'pi pi-fw pi-circle',
                                            routerLink: ['/admin/pages/news'],
                                        }
                                      : null,
                                  {
                                      label: 'Quản lý banner',
                                      icon: 'pi pi-fw pi-circle',
                                      routerLink: ['/admin/pages/banner'],
                                  },
                              ].filter((item) => item !== null),
                          }
                        : null,
                ].filter((item) => item !== null),
            },
        ];
    }
}
