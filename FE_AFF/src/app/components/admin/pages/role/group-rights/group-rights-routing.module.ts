import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GroupRightsComponent } from './group-rights.component';
import { UpdateRoleComponent } from '../update-role/update-role.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: GroupRightsComponent }]),
    ],
    exports: [RouterModule],
})
export class GroupRightsRoutingModule {}
