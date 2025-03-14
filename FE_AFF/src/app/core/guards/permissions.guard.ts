import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/identity/auth.service';
// import { log } from 'console';

@Injectable({
    providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const userPermissions = this.authService.getUserCurrent()?.permissions || [];
        const conditions = route.data['conditions'] as { allOf?: string[]; anyOf?: string[] };
    
        // Kiểm tra nếu không thỏa mãn cả hai loại điều kiện
        const hasPermissions = this.checkPermissions(userPermissions, conditions);
    
        if (hasPermissions) {
            localStorage.removeItem('redirectUrl'); // Clear redirect URL
            return true;
        }
    
        // Lưu URL và chuyển hướng tới blank-page nếu không có quyền
        localStorage.setItem('redirectUrl', state.url);
        this.router.navigate(['/admin/pages/blank-page']);
        return false;
    }

    private checkPermissions(
        userPermissions: string[],
        conditions: { allOf?: string[]; anyOf?: string[] }
    ): boolean {
        const { allOf, anyOf } = conditions;
    
        // Kiểm tra nếu user có tất cả các quyền trong `allOf`
        const hasAllOf = allOf
            ? allOf.every((permission) => userPermissions.includes(permission))
            : false;
    
        // Kiểm tra nếu user có ít nhất một quyền trong `anyOf`
        const hasAnyOf = anyOf
            ? anyOf.some((permission) => userPermissions.includes(permission))
            : false;
    
        // Trả về true nếu thỏa mãn một trong hai điều kiện
        return hasAllOf || hasAnyOf;
    }
    
    

}
