import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { BannerService } from 'src/app/core/services/content/banner.service';

@Component({
    selector: 'app-create-banner',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './create-banner.component.html',
    styleUrl: './create-banner.component.scss',
})
export class CreateBannerComponent {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bannerService: BannerService
    ) {}

    private isSubmitting: boolean = false;

    public banner: any = {
        place: 0,
        type: 0,
        isBlank: true,
    };

    public handleOnSubmitCreateBanner(): void {
        if (this.isSubmitting) {
            return;
        }
        const formData = new FormData();

        formData.append('place', this.banner.place);
        formData.append('type', this.banner.type);
        formData.append('imageFile', this.banner.imageFile);
        formData.append('title', this.banner.title);
        formData.append('description', this.banner.description);
        formData.append('alt', this.banner.title);
        formData.append('ctaTitle', this.banner.ctaTitle);
        formData.append('linkTo', this.banner.linkTo);
        formData.append('properties', this.banner.properties);
        formData.append('isBlank', this.banner.isBlank);
        formData.append('expired', this.banner.expired);
        formData.append('priority', this.banner.priority);

        this.bannerService.create(formData).subscribe(
            (result: any) => {
                this.isSubmitting = true;
                if (result.status) {
                    // this.ngxToastr.success(result.message, '', {
                    //     progressBar: true,
                    // });
                    this.router.navigate(['/admin/pages/banner']);
                }
            },
            (error) => {
                this.isSubmitting = false;
                // this.ngxToastr.error(error.error.message, '', {
                //     progressBar: true,
                // });
            },
            () => {
                this.isSubmitting = false;
            }
        );
    }
}
