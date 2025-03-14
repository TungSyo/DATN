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
import { BlankPageRoutingModule } from './blank-page-routing.module';
import { BlankPageComponent } from './blank-page.component';
import { ToastModule } from 'primeng/toast';


@NgModule({
  imports: [
    CommonModule,
    BlankPageRoutingModule,
    SharedModule,
    ChipsModule,
    InputSwitchModule,
    FileUploadModule,
    ReactiveFormsModule,
    CheckboxModule,
    FormsModule,
    EditorModule,
    ButtonModule,
    RadioButtonModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule
  ],
  declarations: [BlankPageComponent],
})
export class BlankPageModule { }
