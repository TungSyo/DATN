import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeRoutingModule } from 'src/app/components/client/home/home-routing.module';

@NgModule({
    imports: [CommonModule, RouterModule, HomeRoutingModule],
    declarations: [],
})
export class HeaderModule {}
