import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/core/models/categories';
import { MenuItem } from 'primeng/api';
import { TreeNode } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from 'src/app/core/services/identity/auth.service';
import { PermissionConstants } from 'src/app/core/models/permissions';

@Component({
    selector: 'app-show-product-category',
    templateUrl: './show-product-category.component.html',
    styleUrls: ['./show-product-category.component.css'],
})
export class ShowProductCategoryComponent implements OnInit {
    categoryId: number = 0;
    categoryName: string = '';
    parentCategoryName: string = '';
    selectedCategory: TreeNode | null = null;
    parentCategories: TreeNode[] | null = null;
    categorieandchild: TreeNode[] = [];
    categories: any[] = [];
    categoriess: Category = new Category();
    selectedCategoryId!: number;
    isCategorySelected: boolean = false;

    treeOptions!: TreeNode[];
    selectCategory: any = {};
    selectedParentId: number = 0;

    nodes!: any[];
    selectedNodes: any;
    pageSize: number = 30;
    pageIndex: number = 1;
    totalRecordsCount: number = 0;
    currentPageReport: string = '';
    searchTerm: string = '';
    filteredCategories: any[] = [];
    isSubmitting: boolean = false;
    savingInProgress = false;

    showDialog = false;
    showDialogs = false;
    messages: any[] = [];
    errorMessage!: string;
    errorMessageTree: string | null = null;
    showNameError: boolean = false;
    showNameError2: boolean = false;
    showNameError3: boolean = false;
    showNameError4: boolean = false;
    showNameError5: boolean = false;
    notify: any;
    isChecked: boolean = false;
    updateSuccess: boolean = false;
    loadingTableData: boolean = false;
    value: string | undefined;
    checked: boolean = true;
    name: string = '';
    dataLoaded: boolean = false;
    cols: any[] = [];
    items: MenuItem[] | undefined;
    public userCurrent: any;

    private searchTermChanged: Subject<string> = new Subject<string>();

    constructor(
        private categoryService: CategoryService,
        private authService: AuthService
    ) {
        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
        });
    }

    ngOnInit(): void {
        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' },
        ];
        this.items = [
            { icon: 'pi pi-home', route: '/installation' },
            { label: 'Danh mục sản phẩm' },
        ];
        this.searchTermChanged
            .pipe(
                debounceTime(300), // Chờ 300ms sau khi người dùng nhập trước khi gọi hàm
                distinctUntilChanged() // Chỉ gọi khi giá trị thay đổi
            )
            .subscribe((searchTerm) => {
                this.getCategories();
                // this.getAllSubcategories();
            });
        this.getCategories();
        // this.loadCategories();
    }

    getCategoriesAndChild() {
        this.categoryService.getCategoriesAndChild().subscribe((response) => {
            // Chuyển đổi dữ liệu API thành TreeNode
            this.categorieandchild = response;
        });
    }

    onSearchTermChanged(newValue: string): void {
        this.searchTermChanged.next(newValue);
    }

    search(term: string) {
        if (term.trim() !== '') {
            this.categoryService.searchCategories(term).subscribe((results) => {
                this.filteredCategories = this.categories.filter((category) => {
                    return (
                        category.name
                            .toLowerCase()
                            .includes(term.toLowerCase()) ||
                        category.id.toString() === term
                    );
                });
            });
        } else {
            this.filteredCategories = this.categories;
        }
    }

    onSearch(event: any) {
        const term = event.target.value;
        if (term.trim() !== '') {
            this.filteredCategories = this.categories.filter((category) => {
                return (
                    category.name.toLowerCase().includes(term.toLowerCase()) ||
                    category.id.toString() === term
                );
            });
        } else {
            this.filteredCategories = this.categories;
        }
    }

    async getCategories() {
        try {
            const response = await this.categoryService
                .getCategorys(this.pageSize, this.pageIndex, this.name.trim())
                .toPromise();
            this.categories = response.data.items;
            this.totalRecordsCount = response.data.totalRecords;
            this.filteredCategories = this.categories;
            this.updateCurrentPageReport();
            this.getCategorieAll();
            this.treeOptions = this.createCategoryTree(this.filteredCategories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async getCategorieAll() {
        try {
            const response = await this.categoryService
                .getCategoryAll()
                .toPromise();
            this.categories = response.data.items;
            this.treeOptions = this.createCategoryTree(this.categories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    createCategoryTree(categories: any[], parentId: number = 0): TreeNode[] {
        const treeNodes: TreeNode[] = [];
        const filteredCategories = categories.filter(
            (category) => category.parentId === parentId
        );

        filteredCategories.forEach((category) => {
            const treeNode: TreeNode = {
                label: category.name,
                data: category.id,
                children: this.createCategoryTree(categories, category.id),
            };
            treeNodes.push(treeNode);
        });

        return treeNodes;
    }

    onTreeSelectFocus() {
        // Chỉ tải dữ liệu khi `TreeSelect` được chọn và dữ liệu chưa được tải trước
        if (!this.dataLoaded) {
            this.getCategoriesAndChild();
        }
    }

    getAllSubcategoriesRecursive(parentCategory: TreeNode) {
        this.categoryService.getSubcategories(parentCategory.data.id).subscribe(
            (response) => {
                parentCategory.children = response.data.items.map(
                    (category: any) => this.mapToTreeNode(category)
                );
                // Lặp lại cho tất cả các danh mục con
                if (parentCategory.children) {
                    parentCategory.children.forEach((childCategory) => {
                        this.getAllSubcategoriesRecursive(childCategory);
                    });
                }
            },
            (error) => {
                console.error('Error fetching subcategories:', error);
            }
        );
    }

    mapToTreeNode(category: any): TreeNode {
        return {
            label: category.name,
            data: category,
            leaf: !category.children,
            children: undefined, // Khởi tạo children là null, sẽ được cập nhật sau
        };
    }

    onNodeSelect(event: any) {
        const selectedNode = event.node;
        this.selectedCategory = selectedNode; // Cập nhật selectedCategory với node được chọn
        if (!selectedNode.data.parentId) {
            // Nếu là danh mục cha, kiểm tra xem danh sách danh mục cháu đã được tải chưa
            if (!selectedNode.children) {
                this.getAllSubcategoriesRecursive(selectedNode);
            }
        }
    }

    onNodeUnselect(event: any) {
        const unselectedNode = event.node;
        if (this.selectedCategory === unselectedNode) {
            this.selectedCategory = null; // Reset selectedCategory nếu node bị bỏ chọn là node hiện tại
        }
        unselectedNode.children = null; // Clear children when a node is unselected
    }

    openDialog() {
        const userPermissions = this.authService.getUserCurrent()?.permissions || [];

        const hasRequiredPermissions = [PermissionConstants.ManageProductCategory, PermissionConstants.ManageProductCategoryCreate].every(permission =>
            userPermissions.includes(permission)
        );

        const hasRequiredPermissions2 = [PermissionConstants.Admin, PermissionConstants.Master].some(permission =>
            userPermissions.includes(permission)
        );

        if (hasRequiredPermissions || hasRequiredPermissions2) {
            this.showDialog = true;
            this.getCategoriesAndChild();
        } else {
            this.messages = [{
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Bạn không có quyền truy cập',
                life: 3000
            }];
        }
    }

    closeDialog(categoryForm: NgForm) {
        this.showDialog = false;
        categoryForm.reset();
        this.checked = true;
        this.showNameError = false;
        this.showNameError2 = false;
        this.showNameError3 = false;
        this.showNameError4 = false;
        this.showNameError5 = false;
    }

    async editCategory(categoryId: number) {
        const userPermissions = this.authService.getUserCurrent()?.permissions || [];

        const hasRequiredPermissions = [PermissionConstants.ManageProductCategory, PermissionConstants.ManageProductCategoryEdit].every(permission =>
            userPermissions.includes(permission)
        );

        const hasRequiredPermissions2 = [PermissionConstants.Admin, PermissionConstants.Master].some(permission =>
            userPermissions.includes(permission)
        );

        if (hasRequiredPermissions || hasRequiredPermissions2) {
            this.selectedCategoryId = categoryId;
            try {
                const response = await this.categoryService
                    .getCategoryById(categoryId)
                    .toPromise();
                this.selectCategory = response.data;
                this.selectCategory.parentId = this.findTreeNode(
                    this.selectCategory.parentId,
                    this.treeOptions
                );
                this.disableCurrentCategoryInTree();
                this.isCategorySelected = true;
                this.showDialogs = true;
                this.getCategories();
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        } else {
            this.messages = [{
                severity: 'warn',
                summary: 'Cảnh báo',
                detail: 'Bạn không có quyền truy cập',
                life: 3000
            }];
        }

    }

    findTreeNode(id: number, nodes: TreeNode[]): TreeNode | null {
        for (const node of nodes) {
            if (node.data === id) {
                return node;
            }
            if (node.children && node.children.length > 0) {
                const foundNode = this.findTreeNode(id, node.children);
                if (foundNode) {
                    return foundNode;
                }
            }
        }
        return null;
    }

    disableCurrentCategoryInTree() {
        this.treeOptions.forEach((node) => {
            this.setSelectableForNode(node, this.selectCategory.id, false);
        });
    }

    onPageChange(event: any): void {
        this.pageSize = event.rows;
        this.pageIndex = event.page + 1; // Pages start from 0 in p-table, so adding 1 to it
        this.getCategories();
    }

    goToPreviousPage(): void {
        if (this.pageIndex > 1) {
            this.pageIndex--;
            this.getCategories();
        }
    }

    goToNextPage(): void {
        const lastPage = Math.ceil(this.totalRecordsCount / this.pageSize);
        if (this.pageIndex < lastPage) {
            this.pageIndex++;
            this.getCategories();
        }
    }

    updateStatus(id: number, isDeleted: number): void {
        this.categoryService.updateStatus(id, isDeleted).subscribe(
            () => {
                console.log('Brand updated successfully', id, isDeleted);
                this.getCategories();
            },
            (error) => {
                console.error('Error updating brand:', error);
                this.getCategories();
            }
        );
    }

    updateCurrentPageReport(): void {
        const startRecord = (this.pageIndex - 1) * this.pageSize + 1;
        const endRecord = Math.min(
            this.pageIndex * this.pageSize,
            this.totalRecordsCount
        );
        if (this.totalRecordsCount === 0) {
            this.currentPageReport = `<strong>0</strong> - <strong>${endRecord}</strong> trong <strong>${this.totalRecordsCount}</strong> bản ghi`;
        }
        if (this.totalRecordsCount > 0) {
            this.currentPageReport = `<strong>${startRecord}</strong> - <strong>${endRecord}</strong> trong <strong>${this.totalRecordsCount}</strong> bản ghi`;
        }
    }

    setSelectableForNode(
        node: TreeNode,
        categoryId: number,
        selectable: boolean
    ) {
        if (node.data === categoryId) {
            node.selectable = selectable;
        }
        if (node.children && node.children.length > 0) {
            node.children.forEach((childNode) =>
                this.setSelectableForNode(childNode, categoryId, selectable)
            );
        }
    }

    closeDialog2(categoryForm2: NgForm) {
        this.showDialogs = false;
        categoryForm2.reset();
        this.showNameError = false;
        this.showNameError2 = false;
        this.showNameError3 = false;
        this.showNameError4 = false;
        this.showNameError5 = false;
        this.errorMessageTree = null;
    }

    checkDescriptionLength2() {
        if (
            this.selectCategory.description &&
            this.selectCategory.description.length > 500
        ) {
            this.showNameError3 = true;
        } else {
            this.showNameError3 = false;
        }
    }

    onCategorySelect(event: any) {
        if (this.selectCategory && this.selectCategory.id === event.node.data) {
            this.errorMessageTree =
                'Không thể chọn cùng danh mục với danh mục cha của nó';
            this.selectCategory.parentId = undefined;
            this.isCategorySelected = false;
        } else {
            this.errorMessageTree = null; // Clear error message if different category is selected
        }
    }

    checkNameLength2() {
        const nameValue = this.categoriess.name;

        if (!this.selectCategory.name || this.selectCategory.name.length <= 1) {
            this.showNameError = true;
        }

        if (
            (this.selectCategory.name &&
                this.selectCategory.name.length > 100) ||
            (this.selectCategory.name.length < 3 &&
                this.selectCategory.name.length > 0)
        ) {
            this.showNameError4 = true;
            this.showNameError = false;
        }

        if (!nameValue) {
            // Nếu rỗng, ẩn đi tất cả các lỗi
            this.showNameError = false;
            this.showNameError2 = false;
            this.showNameError4 = false;
            return;
        } else {
            this.showNameError4 = false;
        }
    }

    async onSubmitAdd(categoryForm: NgForm) {
        if (this.savingInProgress) {
            return;
        }
        if (
            categoryForm.controls['name'].invalid ||
            categoryForm.controls['name'].value.trim() === ''
        ) {
            this.showNameError = true;
            return;
        } else {
            this.showNameError = false;
        }

        const trimmedName = this.categoriess.name.replace(/\s/g, '');
        if (
            !trimmedName ||
            trimmedName.length < 3 ||
            trimmedName.length > 100
        ) {
            this.showNameError4 = true;
            return;
        }

        if (
            this.categoriess.description &&
            this.categoriess.description.length > 500
        ) {
            this.showNameError3 = true;
            return;
        }

        let str = this.categoriess.name;
        str = str.trim().replace(/\s+/g, ' ');
        console.log(str);

        if (this.selectedCategory) {
            // parentId = this.selectedCategory.data.id; // Cập nhật parentId dựa trên selectedCategory

            // Kiểm tra cấp độ của danh mục hiện tại
            let currentNode = this.selectedCategory;
            let level = 1; // Cấp độ khởi đầu là 1 (danh mục cha)

            // Tính toán cấp độ bằng cách duyệt ngược lên cây danh mục
            while (currentNode.parent) {
                currentNode = currentNode.parent;
                level++;
            }

            // Kiểm tra nếu cấp độ đạt đến cấp 5 hoặc cao hơn
            if (level >= 5) {
                this.showNameError5 = true;
                return;
            }
        }

        try {
            this.categoryService.CheckCategoryExistence(str).subscribe(
                (response) => {
                    if (response.status === true) {
                        this.showNameError2 = true;
                    } else {
                        this.showNameError2 = false;
                        if (!this.checked) {
                            this.categoriess.status = 0; // true tương ứng với 0
                        } else {
                            this.categoriess.status = 1; // false tương ứng với 1
                        }

                        this.categoriess.parentId = 0;

                        if (this.selectedCategory) {
                            this.categoriess.parentId =
                                this.selectedCategory.data.id;
                        }

                        this.categoryService
                            .createCategory(this.categoriess)
                            .subscribe(
                                (createResponse) => {
                                    console.log(
                                        'Danh mục được tạo thành công:',
                                        createResponse
                                    );
                                    console.log(this.categoriess);
                                    categoryForm.reset();
                                    this.checked = true;
                                    this.closeDialog(categoryForm);
                                    this.messages = [
                                        {
                                            severity: 'success',
                                            summary: 'Thành công',
                                            detail: 'Danh mục đã được thêm thành công',
                                            life: 3000,
                                        },
                                    ];
                                    this.getCategoriesAndChild();
                                    this.getCategories();

                                    // Tắt các thông báo lỗi
                                    this.showNameError = false;
                                    this.showNameError2 = false;
                                    this.showNameError3 = false;
                                    this.showNameError4 = false;
                                    this.showNameError5 = false;
                                },
                                (error) => {
                                    // Handle error in createCategory
                                    console.error(
                                        'Error creating category:',
                                        error
                                    );
                                }
                            );
                    }
                },
                (error) => {
                    // Handle error in CheckCategoryExistence
                    console.error('Error checking category existence:', error);
                }
            );
        } catch (error) {
            this.errorMessage = 'Tạo danh mục thất bại. Vui lòng thử lại sau.';
            console.error('Đã xảy ra lỗi khi tạo danh mục:', error);
            this.closeDialog(categoryForm);
            this.messages = [
                {
                    severity: 'error',
                    summary: 'Thất bại',
                    detail: 'Thêm danh mục thất bại',
                    life: 3000, // Đặt thời gian sống của thông báo là 3000 miligiây (tương đương 2 giây)
                },
            ];
            this.showNameError = false;
            this.showNameError2 = false;
            this.showNameError3 = false;
            this.showNameError4 = false;
            this.showNameError5 = false;
        } finally {
            this.savingInProgress = false;
        }
    }

    async onSubmitUpdate(categoryForm2: NgForm) {
        if (this.savingInProgress) {
            return;
        }

        let isValid = true;

        if (
            categoryForm2.controls['name'].invalid ||
            categoryForm2.controls['name'].value.trim() === ''
        ) {
            this.showNameError = true;
            isValid = false;
        } else {
            this.showNameError = false;
        }

        const trimmedName = this.selectCategory.name.replace(/\s/g, '');
        if (
            !trimmedName ||
            trimmedName.length < 3 ||
            trimmedName.length > 100
        ) {
            this.showNameError4 = true;
            isValid = false;
        } else {
            this.showNameError4 = false;
        }

        if (
            this.selectCategory.description &&
            this.selectCategory.description.length > 500
        ) {
            this.showNameError3 = true;
            isValid = false;
        } else {
            this.showNameError3 = false;
        }

        if (this.errorMessageTree || !isValid) {
            this.messages = [
                {
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Dữ liệu chưa hợp lệ. Vui lòng kiểm tra lại.',
                    life: 3000,
                },
            ];
            return; // Prevent further execution if there are errors
        }

        //this.selectCategory.version++;

        try {
            this.savingInProgress = true;

            if (this.selectCategory.status !== 0) {
                this.selectCategory.status = this.selectCategory.status ? 1 : 0;
            }

            if (this.selectCategory && this.selectCategory.parentId) {
                this.selectCategory.parentId = this.selectCategory.parentId.data
                    ? this.selectCategory.parentId.data
                    : null;
            }
            const request={
                id:this.selectCategory.id,
                code:this.selectCategory.code,
                name:this.selectCategory.name,
                description:this.selectCategory.description,
                parentId:this.selectCategory.parentId,
                parentName:this.selectCategory.parentName,
                isDeleted:this.selectCategory.isDeleted,
                status:this.selectCategory.status,
                version:this.selectCategory.version,
                level:this.selectCategory.level,

            }

            await this.categoryService
                .updateCategory(request)
                .toPromise();
            categoryForm2.reset();
            this.closeDialog2(categoryForm2);
            this.showDialogs = false;
            this.messages = [
                {
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Danh mục đã được cập nhật thành công',
                    life: 3000,
                },
            ];
            this.savingInProgress = false;
            this.getCategories();
            this.showNameError = false;
            this.showNameError2 = false;
            this.showNameError3 = false;
            this.showNameError4 = false;
            this.showNameError5 = false;
        } catch (error: any) {
            if (error.error.StatusCode === 400) {
                this.showNameError5 = true;
            } else if (error.error.StatusCode === 500) {
                this.showNameError2 = true;
            } else {
                this.errorMessage =
                    'Cập nhật danh mục thất bại. Vui lòng thử lại sau.';
                console.error('Đã xảy ra lỗi khi cập nhật danh mục:', error);
                this.closeDialog2(categoryForm2);
                this.getCategories();
                if (error.error.StatusCode === 4003) {
                    this.messages = [
                        {
                            severity: 'error',
                            summary: 'Thất bại',
                            detail: 'Phiên bản của bạn đã hết hạn',
                            life: 3000,
                        },
                    ];
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else {
                    this.messages = [
                        {
                            severity: 'error',
                            summary: 'Thất bại',
                            detail: 'Có lỗi xảy ra',
                            life: 3000,
                        },
                    ];
                }
                this.showNameError = false;
                this.showNameError2 = false;
                this.showNameError3 = false;
                this.showNameError4 = false;
                this.showNameError5 = false;
            }
        } finally {
            this.savingInProgress = false;
        }
    }
}
