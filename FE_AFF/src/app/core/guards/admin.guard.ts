// Trong file admin.guard.ts
import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';
import { AuthService } from '../services/identity/auth.service';
import roleConstant from '../constants/role.constant';
import { Page } from '../enums/page.enum';

@Injectable({
    providedIn: 'root',
})
export class AdminGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    private roles = roleConstant;

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (
            this.authService.hasRole(this.roles.admin) ||
            this.authService.hasRole(this.roles.master) ||
            //thn code
            this.authService.hasRole(this.roles.employee)
        ) {
            return true;
        } else {
            this.authService.setUserCurrent(null);
            this.authService.setAuthTokenLocalStorage(null);
            this.router.navigate([Page.AdminLogin]);
            return false;
        }
    }
}
