import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsService } from 'src/app/core/services/news.service';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-create',
  templateUrl: './news-create.component.html',
  styleUrl: './news-create.component.scss'
})
export class NewsCreateComponent implements OnInit {
  newsForm: FormGroup;
  selectedFile: File | null = null;
  messages: any[] = [];
  items: MenuItem[] | undefined;
  showDialog3 = false;
  fileSizeError = false;
  showError = false;
  imageUrl: string = '';


  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private router: Router
  ) {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      subDescription: ['', Validators.required],
      content: ['', Validators.required],
      imageFile: [null],
      isActive: [false],
      createdAt: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.items = [
      { icon: 'pi pi-home', route: '/installation' },
      { label: 'Tin tức', route: '/pages/products/show-product' },
      { label: 'Thêm mới' },
    ];
    this.newsForm.get('title')?.valueChanges.subscribe(() => {
      // Khi người dùng bắt đầu nhập, ẩn thông báo lỗi
      this.showError = false;
    });
  }

  isInvalid(fieldName: string): boolean {
    const control = this.newsForm.get(fieldName);
    return control?.invalid && (control?.dirty || control?.touched);
  }


  onFileSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imageUrl = null;
    this.fileSizeError = false;
    this.newsForm.patchValue({
      image: null
    });
  }

  onFileClear() {
    // Xóa thông báo lỗi và file đã chọn
    this.fileSizeError = false;
    this.selectedFile = null;
  }

  openDialog3(): void {
    this.showDialog3 = true;
  }

  closeDialog3() {
    this.showDialog3 = false;
  }

  private async optimizeImagesInContent(content: string): Promise<string> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const images = Array.from(doc.querySelectorAll('img'));

    for (const img of images) {
      const base64Data = img.src;

      if (base64Data.startsWith('data:image')) {
        const optimizedBase64 = await this.compressBase64(base64Data);
        img.src = optimizedBase64;
      }
    }

    return doc.body.innerHTML;
  }

  private compressBase64(base64: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 800; // Giới hạn chiều rộng
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // Nén ảnh, chất lượng 70%
        resolve(compressedBase64);
      };
    });
  }

  onSubmit() {
    if (this.newsForm.get('title')?.invalid) {
      this.showError = true;
      return;
    } else {
      this.showError = false;
    }

    const content = this.newsForm.value.content || '';
    this.optimizeImagesInContent(content).then((optimizedContent) => {
      const formData = new FormData();
      formData.append('Title', this.newsForm.value.title || '');
      formData.append('SubDescription', this.newsForm.value.subDescription || '');
      formData.append('Content', optimizedContent);
      formData.append('ImageFile', this.selectedFile as File || '');
      formData.append('isActive', this.newsForm.value.isActive);
      const createdAt = this.newsForm.value.createdAt;
      if (createdAt) {
        // Lấy giờ cục bộ mà không thay đổi múi giờ
        const localDate = new Date(createdAt);
        const localDateString = localDate.toLocaleDateString('en-GB'); // Hoặc định dạng bạn muốn
        formData.append('CreatedAt', localDateString);
      }

      this.newsService.createNews(formData).subscribe({
        next: (response) => {
          if (response.status) {
            this.messages = [
              {
                severity: 'success',
                summary: 'Thành công',
                detail: 'Thêm mới thành công',
                life: 3000,
              },
            ];
            setTimeout(() => {
              this.router.navigate(['/admin/pages/news']);
            }, 1000);
            this.newsForm.reset();
          }
        },
        error: (err) => {
          this.messages = [
            {
              severity: 'error',
              summary: 'Thất bại',
              detail: 'Đã có lỗi xảy ra',
              life: 3000,
            },
          ];
        },
      });
    });
  }

}
