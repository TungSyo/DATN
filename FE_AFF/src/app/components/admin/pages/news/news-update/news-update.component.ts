import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsService } from 'src/app/core/services/news.service';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-news-update',
  templateUrl: './news-update.component.html',
  styleUrl: './news-update.component.scss'
})
export class NewsUpdateComponent implements OnInit {
  ImgUrl: string = environment.baseApiImageUrl;
  newsForm: FormGroup;
  selectedFile: File | null = null;
  messages: any[] = [];
  items: MenuItem[] | undefined;
  newId!: number;
  selectedNews: any = {};
  imageUrl: string = '';
  showDialog3 = false;
  showError = false; 
  fileSizeError = false;

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.newsForm = this.fb.group({
      id: [0, Validators.required],
      title: ['', Validators.required],
      subDescription: ['', Validators.required],
      content: ['', Validators.required],
      imageFile: [null],
      image: [null],
      isActive: [false],
      createdAt: [null, [Validators.required]]
    });
  }
  ngOnInit(): void {
    this.items = [
      { icon: 'pi pi-home', route: '/installation' },
      { label: 'Tin tức', route: '/pages/products/show-product' },
      { label: 'Cập nhật tin tức' },
    ];
    this.newsForm.get('title')?.valueChanges.subscribe(() => {
      // Khi người dùng bắt đầu nhập, ẩn thông báo lỗi
      this.showError = false;
    });

    this.CallSnaphot();
    this.getNewsById();
  }

  CallSnaphot(): void {
    this.newId = +this.route.snapshot.paramMap.get('id')!;
  }

  onFileSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      // if (file.size > 3 * 1024 * 1024) {
      //   this.fileSizeError = true;
      //   this.selectedFile = null;
      // } else {
      //   this.fileSizeError = false;
      //   this.selectedFile = file;
      // }
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
    this.selectedNews.image = null;
    this.fileSizeError = false;
    this.newsForm.patchValue({
      image: null 
    });
  }

  openDialog3(): void {
    this.showDialog3 = true;
  }

  closeDialog3() {
    this.showDialog3 = false;
  }

  isInvalid(fieldName: string): boolean {
    const control = this.newsForm.get(fieldName);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  getNewsById(): void {
    this.newsService.getById(this.newId)
      .subscribe((response: any) => {
        this.selectedNews = response.data;

        if (this.selectedNews.image) {
          this.imageUrl = `${this.ImgUrl}/${this.selectedNews.image}`;
        }

        const createdAtDate = new Date(this.selectedNews.createdAt);

        this.newsForm.patchValue({
          id: this.selectedNews.id,
          title: this.selectedNews.title,
          subDescription: this.selectedNews.subDescription,
          content: this.selectedNews.content,
          image: this.selectedNews.image,
          isActive: this.selectedNews.isActive,
          createdAt: createdAtDate,
        });
      },
        (error) => {
          console.error('Error fetching news:', error);
        }
      );
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
        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // Nén ảnh, chất lượng 70%
        resolve(compressedBase64);
      };
    });
  }

  updateNews(): void {
    if (this.newsForm.get('title')?.invalid) {
      this.showError = true;
      return;
    } else {
      this.showError = false;
    }

    const content = this.newsForm.value.content || '';
    this.optimizeImagesInContent(content).then((optimizedContent) => {
      const formData = new FormData();
      formData.append('id', this.newsForm.value.id);
      formData.append('title', this.newsForm.value.title);
      formData.append('subDescription', this.newsForm.value.subDescription);
      formData.append('content', optimizedContent);
      formData.append('isActive', this.newsForm.value.isActive);
      const createdAt = this.newsForm.value.createdAt;
      if (createdAt) {
        // Chuyển đổi ngày về múi giờ địa phương trước khi gửi
        const localCreatedAt = new Date(createdAt);
        const timezoneOffset = localCreatedAt.getTimezoneOffset(); // Lấy offset múi giờ (phút)
        localCreatedAt.setMinutes(localCreatedAt.getMinutes() - timezoneOffset); // Điều chỉnh lại giờ
  
        formData.append('createdAt', localCreatedAt.toISOString()); // Gửi ngày theo định dạng ISO
      }
  
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      } else if (this.selectedNews?.image) {
        formData.append('image', this.selectedNews.image);
      }
  
      this.newsService.updateNews(formData).subscribe(
        (response) => {
          this.messages = [
            {
              severity: 'success',
              summary: 'Thành công',
              detail: 'Cập nhật thành công',
              life: 3000,
            },
          ];
          setTimeout(() => {
            this.router.navigate(['/admin/pages/news']);
          }, 1000);
        },
        (error) => {
          console.error('Error updating news:', error);
          this.messages = [
            {
              severity: 'error',
              summary: 'Thất bại',
              detail: 'Đã có lỗi xảy ra',
              life: 3000,
            },
          ];
        }
      );
    });
  }
}
