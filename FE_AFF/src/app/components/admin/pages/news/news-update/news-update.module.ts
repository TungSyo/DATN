import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ChipsModule } from 'primeng/chips';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NewsUpdateRoutingModule } from './news-update-routing.module';
import { NewsUpdateComponent } from './news-update.component';

@NgModule({
  imports: [
    NewsUpdateRoutingModule,
    SharedModule,
    ChipsModule,
    InputSwitchModule,
    FileUploadModule,
    ReactiveFormsModule,
    CheckboxModule,
    FormsModule,
    EditorModule,
    CommonModule,
    ButtonModule,
    RadioButtonModule,
    InputTextModule,
    InputTextareaModule,
  ],
  declarations: [NewsUpdateComponent]
})
export class NewsUpdateModule { }
