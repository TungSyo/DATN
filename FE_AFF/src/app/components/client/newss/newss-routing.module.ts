import { NewssComponent } from './newss.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: NewssComponent }])],
    exports: [RouterModule],
})
export class NewssRoutingModule {}
