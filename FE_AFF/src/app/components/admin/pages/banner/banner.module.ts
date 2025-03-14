import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerRoutingModule } from './banner-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [],
    imports: [CommonModule, BannerRoutingModule, SharedModule, FormsModule],
})
export class BannerModule {}
