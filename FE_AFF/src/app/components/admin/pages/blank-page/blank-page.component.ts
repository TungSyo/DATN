import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionConstants } from 'src/app/core/models/permissions';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/identity/auth.service';

@Component({
  selector: 'app-blank-page',
  templateUrl: './blank-page.component.html',
  styleUrl: './blank-page.component.scss'
})
export class BlankPageComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }
  ngOnInit() {
    const redirectUrl = localStorage.getItem('redirectUrl');

    if (redirectUrl) {
      const userPermissions = this.authService.getUserCurrent()?.permissions || [];

      // Check if user now has permissions
      const requiredPermissions = this.getRequiredPermissionsForUrl(redirectUrl);
      const hasPermissions = requiredPermissions.some(permission =>
        userPermissions.includes(permission)
      );

      if (hasPermissions) {
        localStorage.removeItem('redirectUrl');
        this.router.navigate([redirectUrl]);
      }
    }
  }

  // Function to determine required permissions for a given URL
  private getRequiredPermissionsForUrl(url: string): string[] {

    const permissionMapping: { [key: string]: string[] } = {
      // ManageBrand
      '/admin/pages/brand/show-brand': [
        PermissionConstants.ManageBrand,
        PermissionConstants.ManageBrandView,
        PermissionConstants.Admin,
        PermissionConstants.Master
      ],

      // ManageProductCategory
      '/admin/pages/product-category/show': [
        PermissionConstants.ManageProductCategory,
        PermissionConstants.ManageProductCategoryView,
        PermissionConstants.Admin,
        PermissionConstants.Master,
      ],

      // ManageProduct
      '/admin/pages/products/show-product': [
        PermissionConstants.ManageProduct,
        PermissionConstants.ManageProductView,
        PermissionConstants.ManageProductEdit,
        PermissionConstants.Admin,
        PermissionConstants.Master
      ],
      '/admin/pages/products/create-product': [
        PermissionConstants.ManageProduct,
        PermissionConstants.ManageProductCreate,
        PermissionConstants.Admin,
        PermissionConstants.Master
      ],
      '/admin/pages/products/update-product': [
        PermissionConstants.ManageProduct,
        PermissionConstants.ManageProductEdit,
        PermissionConstants.Admin,
        PermissionConstants.Master
      ],

      // ManageNews
      '/admin/pages/news': [
        PermissionConstants.ManageNews,
        PermissionConstants.ManageNewsView,
        PermissionConstants.Admin,
        PermissionConstants.Master,
      ],
      '/admin/pages/news/create': [
        PermissionConstants.ManageNews,
        PermissionConstants.ManageNewsCreate,
        PermissionConstants.Admin,
        PermissionConstants.Master,
      ],
      '/admin/pages/news/update': [
        PermissionConstants.ManageNews,
        PermissionConstants.ManageNewsEdit,
        PermissionConstants.Admin,
        PermissionConstants.Master,
      ],

      // ManageTree
      '/admin/pages/tree-binary/show': [
        PermissionConstants.ManageTree,
        PermissionConstants.Admin,
        PermissionConstants.Master,
      ],

      // ManageTree
      '/admin/pages/user/show-user': [
        PermissionConstants.ManageUser,
        PermissionConstants.ManageUserView,
        PermissionConstants.Admin,
        PermissionConstants.Master,
      ],

      // ManageTree
      '/admin/pages/role/show-role': [
        PermissionConstants.ManageRole,
        PermissionConstants.ManageRoleView,
        PermissionConstants.Admin,
        PermissionConstants.Master,
      ],

    };

    if (permissionMapping[url]) {
      return permissionMapping[url];
    }

    // Handle dynamic URLs (e.g., /products/update-product/:id)
    if (url.startsWith('/admin/pages/products/update-product')) {
      return permissionMapping['/admin/pages/products/update-product'] || [];
    }

    if (url.startsWith('/admin/pages/news/update')) {
      return permissionMapping['/admin/pages/news/update'] || [];
    }

    return permissionMapping[url] || [];
  }

}
