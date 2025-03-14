import { ContactComponent } from './contact.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: ContactComponent }])],
    exports: [RouterModule],
})
export class ContactRoutingModule {}
