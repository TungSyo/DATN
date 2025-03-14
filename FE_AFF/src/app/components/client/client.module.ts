import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRoutingModule } from './client-routing.module';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ClientRoutingModule,
        ButtonModule,
        FileUploadModule,
        RippleModule,
        InputTextModule,
        ToastModule,
        DropdownModule,
        ToolbarModule,
        DialogModule,
        RadioButtonModule,
        InputNumberModule,
        InputTextareaModule,
        RatingModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
    ],
})
export class ClientModule {}
