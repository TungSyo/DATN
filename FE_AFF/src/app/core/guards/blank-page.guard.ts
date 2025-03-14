import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BlankPageGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const redirectUrl = localStorage.getItem('redirectUrl');

    if (!redirectUrl) {
      // Nếu không có URL lưu trữ trong localStorage, chuyển hướng về trang chính
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
