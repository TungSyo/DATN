import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ProductApiService } from 'src/app/core/services/product-home.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-detail-news',
    templateUrl: './detail-news.component.html',
    styleUrls: ['./detail-news.component.css'],
})
export class DetailNewsComponent implements OnInit {
    newsId: number;
    newsDetail: any;
    safeContent: SafeHtml;
    imageUrl: string = environment.baseApiImageUrl;

    constructor(
        private route: ActivatedRoute,
        private newsService: ProductApiService,
        private sanitizer: DomSanitizer,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Lấy ID tin tức từ URL
        // this.newsId = +this.route.snapshot.paramMap.get('id');
        // this.getNewsDetail(this.newsId);

        this.route.params.subscribe((params) => {
            this.newsId = +params['id']; // Lấy ID từ URL
            this.getNewsDetail(this.newsId);
        });
    }

    getNewsDetail(newsId: number): void {
        const request = { id: newsId };
        this.newsService.getNewsById(request).subscribe(
            (response) => {
                this.newsDetail = response.data;

                // Sanitize content để hiển thị an toàn
                const unsafeHtml = this.newsDetail.content.replace(
                    /<img /g,
                    '<img style="width: 100%; height: auto;" '
                );
                this.safeContent = this.sanitizer.bypassSecurityTrustHtml(
                    unsafeHtml || ''
                );
            },
            (error) => {
                console.error('Lỗi khi lấy chi tiết tin tức:', error);
            }
        );
    }

    goToNewsDetail(newsId: number): void {
        this.router
            .navigate(['/detail-news', newsId], { replaceUrl: true })
            .then(() => {
                window.location.reload(); // Tải lại trang để cập nhật nội dung
            });
    }
}
