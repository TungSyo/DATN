import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
// import { HeaderComponent } from '../shared/header/header.component';
// import { FooterComponent } from '../shared/footer/footer.component';

@NgModule({
    imports: [CommonModule, HomeRoutingModule, SharedModule],
    declarations: [HomeComponent],
})
export class HomeModule {}
