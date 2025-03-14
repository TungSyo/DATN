import { NgModule } from '@angular/core';
import {
    HashLocationStrategy,
    LocationStrategy,
    PathLocationStrategy,
} from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/admin-layout/app.layout.module';
import { NotfoundComponent } from 'src/app/components/admin/shared/notfound/notfound.component';
import { ProductService } from './core/services/product.service';
import { MessageService } from 'primeng/api';
import { ToastService } from './core/services/toast.service';
import { SharedModule } from './shared/modules/shared.module';
import { ClientLayoutModule } from './layout/client-layout/client-layout.module';
import { HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { HttpInterceptor } from './core/interceptors/token.interceptor';
@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        ClientLayoutModule,
        SharedModule,
        HttpClientModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        ProductService,
        MessageService,
        ToastService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
