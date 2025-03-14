import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Products } from 'src/app/core/models/product';
import { ProductService } from 'src/app/core/services/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[];

    products!: Products[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    startDate: any;
    endDate: any;

    revenue: any;

    commission: any;
    users: any;

    constructor(
        public productService: ProductService,
        public dashboardService: DashboardService,
        public layoutService: LayoutService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    request: any = {
        startDate: null,
        endDate: null,
    };

    request1: any;

    ngOnInit() {
        // this.initChart();
        // this.productService
        //     .getProductsSmall()
        //     .then((data) => (this.products = data));

        // this.items = [
        //     { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        //     { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        // ];

        this.request = {
            startDate: new Date(),
            endDate: new Date(),
        };

        this.loadInital();
        // this.startDate = new Date();
        // this.endDate = new Date();
    }

    loadInital(): void {
        // Lấy ngày bắt đầu và kết thúc từ request
        const startDate = new Date(this.request.startDate);
        const endDate = new Date(this.request.endDate);

        // Điều chỉnh thời gian cho giờ Việt Nam (UTC+7)
        const vietnamOffset = 7 * 60; // UTC+7 tính bằng phút (7 giờ * 60 phút)

        // Điều chỉnh thời gian cho startDate và endDate theo giờ Việt Nam (UTC+7)
        const startDateVietnamTime = new Date(
            startDate.getTime() + vietnamOffset * 60000
        );
        const endDateVietnamTime = new Date(
            endDate.getTime() + vietnamOffset * 60000
        );

        // Đặt thời gian cho startDate là 00:00:00 và endDate là 23:59:59
        startDateVietnamTime.setHours(0, 0, 0, 0); // Đặt giờ 00:00:00
        endDateVietnamTime.setHours(23, 59, 59, 999); // Đặt giờ 23:59:59.999

        // Chuyển thành chuỗi định dạng ISO mà không chuyển sang UTC

        startDateVietnamTime.setHours(startDateVietnamTime.getHours() + 7);
        endDateVietnamTime.setHours(endDateVietnamTime.getHours() + 7);
        this.request1 = {
            startDate: startDateVietnamTime.toISOString().replace('Z', ''), // Loại bỏ "Z" để không chuyển sang UTC
            endDate: endDateVietnamTime.toISOString().replace('Z', ''), // Loại bỏ "Z" để không chuyển sang UTC
        };

        // console.log('Request:', request); // Kiểm tra request trước khi gửi đi
        this.loadUser();
        this.loadCommission(); //
        this.loadOrder();
    }

    loadUser(): void {
        this.dashboardService.getUser(this.request1).subscribe((results) => {
            this.users = results.data;
            console.log(results.data); // Hiển thị kết quả trả về
        });
    }
    loadCommission(): void {
        this.dashboardService
            .getCommission(this.request1)
            .subscribe((results) => {
                this.commission = results.data;
            });
    }
    loadOrder(): void {
        this.dashboardService.getRevenue(this.request1).subscribe((results) => {
            this.revenue = results.data;
        });
    }

    // loadDashboard(): void {
    //     // Gửi request tới API
    //     this.dashboardService.getRevenue(request).subscribe((results) => {
    //         this.revenue = results.data;
    //         console.log(this.revenue); // Hiển thị kết quả trả về
    //     });
    // }
    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    tension: 0.4,
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: 0.4,
                },
            ],
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
