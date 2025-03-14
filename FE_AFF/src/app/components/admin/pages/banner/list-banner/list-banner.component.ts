import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
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
import { BannerService } from 'src/app/core/services/content/banner.service';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-list-banner',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './list-banner.component.html',
    styleUrls: ['./list-banner.component.scss'],
    animations: animationConstant.animations,
})
export class ListBannerComponent {
    items: MenuItem[] | undefined;
    createBannerVisible: boolean = false;
    createBannerForm: FormGroup;
    updateBannerForm: FormGroup;
    isChangeUpload = true;
    base64Image: any;
    updateBannerVisible: boolean = false;
    imageFile: any;

    image: any;
    imageUrl: string = environment.baseApiImageUrl;
    //Init

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private bannerService: BannerService,
        private messageService: MessageService
    ) {
        this.createBannerForm = this.formBuilder.group({
            place: [null],
            type: [null],
            imageFile: [null],
            title: [null],
            description: [null],
            alt: [null],
            ctaTitle: [null],
            linkTo: [null],
            properties: [null],
            isBlank: [true],
            expired: [null],
            priority: [0],
        });

        this.updateBannerForm = this.formBuilder.group({
            id: [null],
            place: [null],
            type: [null],
            imageFile: [null],
            title: [null],
            description: [null],
            alt: [null],
            ctaTitle: [null],
            linkTo: [null],
            properties: [null],
            isBlank: [true],
            expired: [null],
            priority: [0],
        });
    }

    ngOnInit() {
        this.items = [
            { label: 'Banner' },
            { label: 'Danh sách', route: '/admin/pages/banner' },
        ];
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
                type: params['type'] ? params['type'] : null,
                place: params['place'] ? params['place'] : null,
            };

            this.getBanners(request);
        });
    }

    //config default
    public config: any = {
        paging: pagingConfig.default,
        baseUrl: systemConfig.baseFileSystemUrl,
        perPageOptions: DEFAULT_PER_PAGE_OPTIONS,
        pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    };

    public constant: any = {
        sort: sortConstant,
        banner: bannerConstant,
    };

    //Banners
    public banners: any = [];

    public paging: any = {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy: '',
        orderBy: '',
        totalRecords: 0,
        totalPages: 0,
    };

    public selectedBanners: any = [];

    public queryParameters: any = {
        ...this.config.paging,
        place: null,
        type: null,
        title: '',
    };

    public getBanners(request: any): any {
        this.bannerService.getPaging(request).subscribe((result: any) => {
            if (result.status) {
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

                this.banners = result.data.items;

                this.banners = this.banners.map((banner: any) => ({
                    ...banner,
                    placeName:
                        this.constant.banner.places.find(
                            (place: any) => place.value === banner.place
                        )?.key ?? '',
                    typeName:
                        this.constant.banner.types.find(
                            (type: any) => type.key === banner.type
                        )?.value ?? '',
                    status:
                        new Date(banner.expired) < new Date() ? false : true,
                }));

                if (this.banners.length === 0) {
                    this.paging.pageIndex = 1;
                }
                console.log(this.banners);
                const { items, ...paging } = result.data;
                this.paging = paging;

                this.selectedBanners = [];
            }
        });
    }

    handleOpenCreateBanner() {
        this.router.navigate(['/admin/pages/banner/create']);
    }

    public selectAllBanners(event: any): void {
        if (event.target.checked) {
            this.selectedBanners = this.banners.map(
                (teacher: any) => teacher.id
            );
        } else {
            this.selectedBanners = [];
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
            this.selectedBanners = this.selectedBanners.filter(
                (id: any) => id !== id
            );
        } else {
            this.selectedBanners.push(id);
        }
    }

    public isSelected(id: number): boolean {
        return this.selectedBanners.includes(id);
    }

    public handleSearchBanners() {
        this.route.queryParams.subscribe((params) => {
            const request = {
                ...params,
                title: this.queryParameters.title
                    ? this.queryParameters.title.trim()
                    : null,
                place: this.queryParameters.place
                    ? this.queryParameters.place
                    : null,
                type: this.queryParameters.type
                    ? this.queryParameters.type
                    : null,
            };

            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: request,
                queryParamsHandling: 'merge',
            });
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

                    this.bannerService.delete(request).subscribe((result) => {
                        console.log(result);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Thông báo',
                            detail: 'Xóa banner thành công!',
                        });
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
                        this.getBanners(this.queryParameters);
                    });
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
                title: `Bạn có muốn xoá các bản ghi có Id: ${this.selectedBanners.join(
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
                        ids: this.selectedBanners,
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

    public handleOnSubmitCreateBanner(): void {
        // if (this.isSubmitting) {
        //     return;
        // }
        const formData = new FormData();
        formData.append('place', this.createBannerForm.value.place.value);
        formData.append('type', this.createBannerForm.value.type.value);
        formData.append('imageFile', this.imageFile);
        formData.append('title', this.createBannerForm.value.title);
        formData.append('description', this.createBannerForm.value.description);
        formData.append('alt', this.createBannerForm.value.title);
        formData.append('ctaTitle', this.createBannerForm.value.ctaTitle);
        formData.append('linkTo', this.createBannerForm.value.linkTo);
        formData.append('properties', this.createBannerForm.value.properties);
        formData.append('isBlank', this.createBannerForm.value.isBlank);
        formData.append(
            'expired',
            this.createBannerForm.value.expired.toISOString()
        );
        formData.append('priority', this.createBannerForm.value.priority);
        this.bannerService.create(formData).subscribe(
            (result: any) => {
                // this.isSubmitting = true;
                // if (result.status) {
                // this.ngxToastr.success(result.message, '', {
                //     progressBar: true,
                // });
                // this.router.navigate(['/admin/pages/banner']);

                // }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Thêm banner thành công!',
                });
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
                this.createBannerForm.reset();
                this.getBanners(this.queryParameters);
                this.createBannerVisible = false;
            },
            (error) => {
                // this.isSubmitting = false;
                // this.ngxToastr.error(error.error.message, '', {
                //     progressBar: true,
                // });
            },
            () => {
                // this.isSubmitting = false;
            }
        );
    }

    public handleChangeImage(event: any): void {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.isChangeUpload = false;
                this.base64Image = e.target.result;
            };

            reader.readAsDataURL(file);

            this.imageFile = file;

            console.log(this.imageFile);
        }
    }

    public handleUpdateItem(banner: any): void {
        console.log(banner); // In đối tượng banner để kiểm tra dữ liệu

        this.image = banner.image;
        this.updateBannerForm = this.formBuilder.group({
            id: [banner.id || null], // Đổ giá trị id
            place: [
                this.constant.banner.places.find(
                    (item: any) => item.value == banner.place
                ) || null,
            ], // Đổ giá trị place hoặc để null nếu không có
            type: [
                this.constant.banner.types.find(
                    (item: any) => item.value == banner.type
                ) || null,
            ], // Đổ giá trị type
            imageFile: [banner.imageFile || null], // Đổ giá trị imageFile
            title: [banner.title || null], // Đổ giá trị title
            description: [banner.description || null], // Đổ giá trị description
            alt: [banner.alt || null], // Đổ giá trị alt
            ctaTitle: [banner.ctaTitle || null], // Đổ giá trị ctaTitle
            linkTo: [banner.linkTo || null], // Đổ giá trị linkTo
            properties: [banner.properties || null], // Đổ giá trị properties
            isBlank: [banner.isBlank ?? true], // Đổ giá trị isBlank, mặc định true nếu null/undefined
            expired: [banner.expired ? new Date(banner.expired) : null], // Đổ giá trị expired, chuyển về Date nếu có
            priority: [banner.priority || 0], // Đổ giá trị priority, mặc định 0 nếu null/undefined
        });
        this.updateBannerVisible = true; // Hiển thị form cập nhật
    }

    onDialogClose(): void {
        this.updateBannerVisible = false;
        this.base64Image = null;
    }

    public handleOnSubmitUpdateBanner(): void {
        // if (this.isSubmitting) {
        //     return;
        // }

        console.log(this.updateBannerForm.value);
        const formData = new FormData();
        formData.append('id', this.updateBannerForm.value.id);
        formData.append('place', this.updateBannerForm.value.place.value);
        formData.append('type', this.updateBannerForm.value.type.value);
        formData.append('imageFile', this.imageFile);
        formData.append('title', this.updateBannerForm.value.title);
        formData.append('description', this.updateBannerForm.value.description);
        formData.append('alt', this.updateBannerForm.value.title);
        formData.append('ctaTitle', this.updateBannerForm.value.ctaTitle);
        formData.append('linkTo', this.updateBannerForm.value.linkTo);
        formData.append('properties', this.updateBannerForm.value.properties);
        formData.append('isBlank', this.updateBannerForm.value.isBlank);
        formData.append(
            'expired',
            this.updateBannerForm.value.expired.toISOString()
        );
        formData.append('priority', this.updateBannerForm.value.priority);
        this.bannerService.update(formData).subscribe(
            (result: any) => {
                // this.isSubmitting = true;
                // if (result.status) {
                // this.ngxToastr.success(result.message, '', {
                //     progressBar: true,
                // });
                // this.router.navigate(['/admin/pages/banner']);

                // }

                if (result.status) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Thông báo',
                        detail: 'Thêm banner thành công!',
                    });
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
                    this.updateBannerForm.reset();
                    this.getBanners(this.queryParameters);
                    this.updateBannerVisible = false;
                }
            },
            (error) => {
                // this.isSubmitting = false;
                // this.ngxToastr.error(error.error.message, '', {
                //     progressBar: true,
                // });
            },
            () => {
                // this.isSubmitting = false;
            }
        );
    }
}
