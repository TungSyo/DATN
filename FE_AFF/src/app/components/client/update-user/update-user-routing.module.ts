import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpdateUserComponent } from './update-user.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: UpdateUserComponent }]),
    ],
    exports: [RouterModule],
})
export class UpdateUserRoutingModule {}
