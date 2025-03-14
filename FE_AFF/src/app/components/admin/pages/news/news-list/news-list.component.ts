import { Component, OnInit, ViewChild } from '@angular/core';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { BrandService } from 'src/app/core/services/brand.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { MenuItem, MessageService } from 'primeng/api';
import { NewsService } from 'src/app/core/services/news.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss'
})
export class NewsListComponent implements OnInit {
  ImgUrl: string = environment.baseApiImageUrl;
  pageSize: number = 30;
  pageIndex: number = 1;
  items: MenuItem[] | undefined;
  news: any[] = [];
  totalRecords: number = 0;
  currentPageReport: string = '';
  title: string = '';
  messages: any[] = [];
  contentDialogVisible: boolean = false;
  selectedContent: string | null = null;
  showDiaLogDelete: boolean = false;
  currentDeleteId: number | null = null;

  private searchTermChanged: Subject<string> = new Subject<string>();

  constructor(
    private newService: NewsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.items = [
      { icon: 'pi pi-home', route: '/installation' },
      { label: 'Tin tức' },
      { label: 'Danh sách' },
    ];
    this.searchTermChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.getNewPaging();
      });
    this.getNewPaging();
  }

  openContentDialog(content: string) {
    this.selectedContent = content; // Gán nội dung cho dialog
    this.contentDialogVisible = true; // Mở dialog
  }

  toggleDescription(newsr: any): void {
    newsr.isDescriptionExpanded = !newsr.isDescriptionExpanded;
  }


  getNewPaging(): void {
    const request: any = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      title: this.title.trim()
    };
    this.newService
      .getNewsPaging(request)
      .subscribe(
        (response: any) => {
          this.news = response.data.items;
          this.news.forEach(item => item.isDescriptionExpanded = false);
          this.totalRecords = response.data.totalRecords;
          this.updateCurrentPageReport();
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  onPageChange(event: any): void {
    this.pageSize = event.rows;
    this.pageIndex = event.page + 1;
    this.getNewPaging();
  }

  goToPreviousPage(): void {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.getNewPaging();
    }
  }

  goToNextPage(): void {
    const lastPage = Math.ceil(this.totalRecords / this.pageSize);
    if (this.pageIndex < lastPage) {
      this.pageIndex++;
      this.getNewPaging();
    }
  }
  updateCurrentPageReport(): void {
    const startRecord = (this.pageIndex - 1) * this.pageSize + 1;
    const endRecord = Math.min(
      this.pageIndex * this.pageSize,
      this.totalRecords
    );
    if (this.totalRecords === 0) {
      this.currentPageReport = `<strong>0</strong> - <strong>${endRecord}</strong> trong <strong>${this.totalRecords}</strong> bản ghi`;
    }
    if (this.totalRecords > 0) {
      this.currentPageReport = `<strong>${startRecord}</strong> - <strong>${endRecord}</strong> trong <strong>${this.totalRecords}</strong> bản ghi`;
    }
  }

  ClickDelete(): void {
    if (this.currentDeleteId !== null) {
      // Gọi service để xóa tin tức
      this.newService.deleteNews({id:this.currentDeleteId}).subscribe({
        next: () => {
          this.messages = [
            {
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa tin tức thành công',
              life: 3000,
            },
          ];
          this.closeDiaLogDelete(); // Đóng hộp thoại
          this.getNewPaging(); // Tải lại danh sách tin tức
        },
        error: (error) => {
          console.error('Lỗi khi xóa:', error);
          this.messages = [
            {
              severity: 'error',
              summary: 'Thất bại',
              detail: 'Có lỗi xảy ra',
              life: 3000,
            },
          ];
        },
      });
    }
  }

  toggleActive(id: number, isActive: boolean): void {
    this.newService.toggleActive(id).subscribe(
      (response: any) => {
        this.messages = [
          {
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật trạng thái thành công',
            life: 3000,
          },
        ];
      },
      (error) => {
        // Nếu cập nhật thất bại, khôi phục giá trị ban đầu
        const updatedNews = this.news.find(n => n.id === id);
        if (updatedNews) {
          updatedNews.isActive = !isActive;
        }
        this.messages = [
          {
            severity: 'error',
            summary: 'Thất bại',
            detail: 'Có lỗi xảy ra',
            life: 3000,
          },
        ];
      }
    );
  }

  openDiaLogDelete(id: number): void {
    this.currentDeleteId = id;
    this.showDiaLogDelete = true;
  }

  // Hàm đóng hộp thoại xóa
  closeDiaLogDelete(): void {
    this.showDiaLogDelete = false;
    this.currentDeleteId = null;
  }
}
