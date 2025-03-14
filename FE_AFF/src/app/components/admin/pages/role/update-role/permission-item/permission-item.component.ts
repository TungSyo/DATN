
// import { CommonModule } from '@angular/common';
// import { Component, Input, Output, EventEmitter } from '@angular/core';


// @Component({
//   selector: 'app-permission-item',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './permission-item.component.html',
//   styleUrl: './permission-item.component.scss'
// })
// export class PermissionItemComponent {
//   @Input() permission: any;
//   @Input() selectedPermissions: any[] = [];
//   @Output() selectedPermissionsChange = new EventEmitter<any[]>();

//   isExpanded: boolean = false; // Biến kiểm soát trạng thái mở/đóng thư mục

//   // Kiểm tra xem quyền đã được chọn hay chưa
//   isSelected(permission: any): boolean {
//     return this.selectedPermissions.includes(permission.id);
//   }

//   // Thay đổi trạng thái mở/đóng thư mục
//   toggleExpansion() {
//     this.isExpanded = !this.isExpanded;
//   }

//   // Thay đổi trạng thái chọn của quyền
//   togglePermission(permission: any, event: any) {
//     const checked = event.target.checked;

//     // Thêm/xóa quyền vào danh sách selectedPermissions
//     if (checked) {
//       this.addPermission(permission);
//     } else {
//       this.removePermission(permission);
//     }

//     // Phát ra sự kiện để cập nhật selectedPermissions
//     this.selectedPermissionsChange.emit(this.selectedPermissions);
//   }

//   // Thêm quyền vào danh sách đã chọn (cả quyền cha và quyền con)
//   addPermission(permission: any) {
//     if (!this.selectedPermissions.includes(permission.id)) {
//       this.selectedPermissions.push(permission.id);
//     }

//     // Đệ quy thêm tất cả quyền con nếu có
//     if (permission.childrens && permission.childrens.length > 0) {
//       permission.childrens.forEach((child: any) => this.addPermission(child));
//     }
//   }

//   // Bỏ chọn quyền và cả quyền con (nếu có)
//   removePermission(permission: any) {
//     this.selectedPermissions = this.selectedPermissions.filter(id => id !== permission.id);

//     // Đệ quy bỏ chọn tất cả quyền con
//     if (permission.childrens && permission.childrens.length > 0) {
//       permission.childrens.forEach((child: any) => this.removePermission(child));
//     }
//   }
// }



import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@Component({
	selector: 'app-permission-item',
	standalone: true,
	imports: [CommonModule, CheckboxModule, SharedModule],
	templateUrl: './permission-item.component.html',
	styleUrl: './permission-item.component.scss'
})
export class PermissionItemComponent implements OnInit {

	ngOnInit(): void {
	}


	@Input() permission: any;
	@Input() selectedPermissions: any[] = [];
	@Input() permissionsTree: any[] = [];
	@Output() selectedPermissionsChange = new EventEmitter<any[]>();

	isExpanded: boolean = false;

	// Kiểm tra quyền đã được chọn chưa
	isSelected(permission: any): boolean {
		return this.selectedPermissions.includes(permission.id);
	}

	// Thay đổi trạng thái mở/đóng của thư mục
	toggleExpansion() {
		this.isExpanded = !this.isExpanded;
	}

	// Xử lý khi checkbox được thay đổi
	togglePermission(permission: any, event: any) {
		const checked = event.target.checked;

		if (checked) {
			this.addPermission(permission);
			this.addParentPermissions(permission);
		} else {
			this.removePermission(permission);
		}
		// console.log(checked);
		// console.log(this.selectedPermissions);
		// this.selectedPermissionsChange.emit(this.selectedPermissions);
		// this.selectedPermissionsChange.emit([...this.selectedPermissions]); 

	}

	// Thêm quyền và các quyền con vào danh sách đã chọn
	addPermission(permission: any) {
		if (!this.selectedPermissions.includes(permission.id)) {
			this.selectedPermissions.push(permission.id);
		}

		// Đệ quy thêm tất cả các quyền con
		if (permission.childrens && permission.childrens.length > 0) {
			permission.childrens.forEach((child: any) => this.addPermission(child));
		}

		this.selectedPermissionsChange.emit([...this.selectedPermissions]); 

	}

	// Bỏ chọn quyền và các quyền con
	removePermission(permission: any) {
		this.selectedPermissions = this.selectedPermissions.filter(id => id !== permission.id);

		// Đệ quy bỏ chọn tất cả các quyền con
		if (permission.childrens && permission.childrens.length > 0) {
			permission.childrens.forEach((child: any) => this.removePermission(child));
		}
		this.selectedPermissionsChange.emit([...this.selectedPermissions]); 

	}

	// Đệ quy chọn tất cả quyền cha khi chọn quyền con
	addParentPermissions(permission: any) {
		if (permission.parentPermissionId) {
			// console.log("hi")
			// Tìm quyền cha của permission
			const parent = this.findParentPermission(permission.parentPermissionId, this.permissionsTree);
			// console.log("hi"+JSON.stringify(parent));
			if (parent && !this.isSelected(parent)) {
				// console.log("hah"+JSON.stringify(parent));
				this.selectedPermissions.push(parent.id);
				this.addParentPermissions(parent); // Đệ quy chọn cha của cha
			}
			this.selectedPermissionsChange.emit([...this.selectedPermissions]); 

		}
		

		// console.log("12"+JSON.stringify(permission))
		// console.log("dd"+JSON.stringify(this.permissionsTree))
		// console.log("hihi");
	}

	// Hàm tìm kiếm quyền cha dựa trên parentPermissionId
	findParentPermission(parentId: number, permissions: any[]): any | null {
		for (let permission of permissions) {
			if (permission.id === parentId) {
				return permission;
			}
			if (permission.childrens && permission.childrens.length > 0) {
				const found = this.findParentPermission(parentId, permission.childrens);
				if (found) {
					return found;
				}
			}
		}
		return null;
	}

	onChildPermissionsChange(updatedPermissions: any[]) {
		this.selectedPermissions = updatedPermissions;
	
		this.selectedPermissionsChange.emit(updatedPermissions);
	}
	
}