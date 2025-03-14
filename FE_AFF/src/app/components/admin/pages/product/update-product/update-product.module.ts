import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';

import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ChipsModule } from 'primeng/chips';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { UpdateProductRoutingModule } from './update-product-routing.module';
import { UpdateProductComponent } from './update-product.component';

@NgModule({
  imports: [
    UpdateProductRoutingModule,
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
    RadioButtonModule
  ],
  declarations: [UpdateProductComponent]
})
export class UpdateProductModule { }
