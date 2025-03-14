// import { Component } from '@angular/core';
// import { ProductApiService } from 'src/app/core/services/product-home.service';
// import { environment } from 'src/environments/environment';
// import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// @Component({
//   selector: 'app-newss',
//   templateUrl: './newss.component.html',
//   styleUrls: ['./newss.component.scss']
// })
// export class NewssComponent {
//   imageUrl: string = environment.baseApiImageUrl;
//   allNews: any[] = []; // Tất cả tin tức lấy từ API
//   news: any[] = []; // Tin tức hiển thị trên trang hiện tại
//   currentPage: number = 1;
//   totalPage: number = 0;
//   pageSize: number = 6; // Mỗi trang có 6 tin tức
//   latestNews: any[] = []; // Lưu trữ 3 tin mới nhất

//   constructor(
//     private productApiService: ProductApiService,
//     private sanitizer: DomSanitizer
//   ) {}

//   ngOnInit(): void {
//     this.loadAllNews(); // Lấy toàn bộ tin tức một lần

//     this.news = this.news.map(news => ({
//       ...news,
//       safeContent: this.sanitizer.bypassSecurityTrustHtml(news.content)
//     }));
//   }
  
//   loadAllNews() {
//     this.allNews = []; // Đặt lại mảng tin tức
//     const pageSize = 100; // Đặt pageSize lớn hơn để lấy thêm dữ liệu mỗi lần
//     let pageIndex = 1;
  
//     const fetchPage = () => {
//       this.productApiService.getNews({ pageIndex, pageSize }).subscribe(
//         (res) => {
//           if (res && Array.isArray(res.data.items)) {
//             this.news = res.data.items.map((item: any) => ({
//               ...item,
//               safeContent: this.sanitizer.bypassSecurityTrustHtml(item.content), // Xử lý nội dung an toàn
//             }));
//             // Thêm các tin tức từ trang hiện tại vào allNews
//             this.allNews = [...this.allNews, ...res.data.items];
//             console.log(`Dữ liệu từ API trang ${pageIndex}:`, res.data.items);
            
//             // Kiểm tra nếu còn nhiều trang nữa, tiếp tục gọi API cho trang tiếp theo
//             if (pageIndex < res.data.totalPages) {
//               pageIndex++;
//               fetchPage(); // Gọi lại để lấy trang tiếp theo
//             } else {
//               // Khi đã lấy hết các trang
//               console.log('Tổng số tin tức:', this.allNews.length);
  
//               // Tính tổng số trang dựa trên pageSize hiển thị
//               this.totalPage = Math.ceil(this.allNews.length / this.pageSize);
  
//               // Hiển thị tin tức cho trang đầu tiên
//               this.updateNewsForPage(this.currentPage);
//             }
//           } else {
//             this.allNews = [];
//             this.news = [];
//           }
//         },
//         (error) => {
//           console.error('Lỗi khi tải tin tức:', error);
//         }
//       );
//     };
  
//     // Bắt đầu quá trình lấy dữ liệu từ trang đầu tiên
//     fetchPage();
//   }
  

//   updateNewsForPage(page: number) {
//     // Phân trang thủ công dựa trên dữ liệu đã tải
//     const startIndex = (page - 1) * this.pageSize;
//     const endIndex = startIndex + this.pageSize;
//     this.news = this.allNews.slice(startIndex, endIndex);

//     if (page === 1) {
//       this.latestNews = this.news.slice(0, 5); // Chỉ lấy 3 tin đầu tiên
//     }

//     // Cập nhật trang hiện tại
//     this.currentPage = page;

//     // Cuộn lên đầu trang khi thay đổi trang
//     window.scrollTo(0, 0);
//   }

//   changePage(page: number) {
//     if (page >= 1 && page <= this.totalPage) {
//       this.updateNewsForPage(page);
//     }
//   }

//   prevPage() {
//     if (this.currentPage > 1) {
//       this.changePage(this.currentPage - 1);
//     }
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPage) {
//       this.changePage(this.currentPage + 1);
//     }
//   }
// }




import { Component } from '@angular/core';
import { ProductApiService } from 'src/app/core/services/product-home.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-newss',
  templateUrl: './newss.component.html',
  styleUrls: ['./newss.component.scss']
})
export class NewssComponent {
  imageUrl: string = environment.baseApiImageUrl;
  allNews: any[] = []; // Tất cả tin tức lấy từ API
  news: any[] = []; // Tin tức hiển thị trên trang hiện tại
  currentPage: number = 1;
  totalPage: number = 0;
  pageSize: number = 6; // Mỗi trang có 6 tin tức
  latestNews: any[] = []; // Lưu trữ 3 tin mới nhất

  constructor(
    private productApiService: ProductApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadAllNews(); // Lấy toàn bộ tin tức một lần

    this.news = this.news.map(news => ({
      ...news,
      safeContent: this.sanitizer.bypassSecurityTrustHtml(news.content)
    }));
  }

  get filteredNews() {
    return this.news.filter(item => item.isActive);
  }
  
  loadAllNews() {
    this.allNews = [];
    let pageIndex = 1;
  
    const fetchPage = () => {
      this.productApiService.getNews({ pageIndex }).subscribe(
        (res) => {
          if (res && Array.isArray(res.data.items)) {
            const filteredNews = res.data.items.filter((item: any) => item.isActive);
            this.news = filteredNews.map((item: any) => ({
              ...item,
              safeContent: this.sanitizer.bypassSecurityTrustHtml(item.content),
            }));
  
            this.allNews = [...this.allNews, ...filteredNews];
            console.log(`Dữ liệu từ API trang ${pageIndex}:`, filteredNews);
  
            if (filteredNews.length > 0) {
              pageIndex++;
              fetchPage();
            } else {
              console.log('Tổng số tin tức:', this.allNews.length);
              this.totalPage = Math.ceil(this.allNews.length / this.pageSize);
              this.updateNewsForPage(this.currentPage);
            }
          } else {
            this.allNews = [];
            this.news = [];
          }
        },
        (error) => {
          console.error('Lỗi khi tải tin tức:', error);
        }
      );
    };
  
    fetchPage();
  }
  

  updateNewsForPage(page: number) {
    // Phân trang thủ công dựa trên dữ liệu đã tải
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.news = this.allNews.slice(startIndex, endIndex);

    if (page === 1) {
      this.latestNews = this.news.slice(0, 5); // Chỉ lấy 3 tin đầu tiên
    }

    // Cập nhật trang hiện tại
    this.currentPage = page;

    // Cuộn lên đầu trang khi thay đổi trang
    window.scrollTo(0, 0);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPage) {
      this.updateNewsForPage(page);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPage) {
      this.changePage(this.currentPage + 1);
    }
  }
}
