import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@Component({
    selector: 'app-update-banner',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './update-banner.component.html',
    styleUrl: './update-banner.component.scss',
})
export class UpdateBannerComponent {}
