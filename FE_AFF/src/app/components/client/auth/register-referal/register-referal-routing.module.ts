import { RegisterReferalComponent } from './register-referal.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: RegisterReferalComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class RegisterReferalRoutingModule {}
