import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateRoleRoutingModule } from './update-role-routing.module';
import { UpdateRoleComponent } from './update-role.component';

@NgModule({
    imports: [CommonModule, UpdateRoleRoutingModule],
})
export class UpdateRoleModule {}
