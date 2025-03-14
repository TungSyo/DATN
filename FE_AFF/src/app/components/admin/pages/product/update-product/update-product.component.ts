import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { FunctionService } from 'src/app/core/utils/function.utils';
import {
    Component,
    ViewChild,
    OnInit,
    ChangeDetectorRef,
    ElementRef,
    SimpleChanges,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormArray,
    FormControl,
    AbstractControl,
} from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { Table } from 'primeng/table';
import { Brand } from 'src/app/core/models/brands';
import { BrandService } from 'src/app/core/services/brand.service';
// import { CollectionService } from 'src/app/core/services/collection.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';
import { Products, ProductVariant } from 'src/app/core/models/product';
import { ActivatedRoute, Router } from '@angular/router';
// import { WarrantyPolicyService } from 'src/app/core/services/warranty-policy.service';
import { environment } from 'src/environments/environment';
import { el } from '@fullcalendar/core/internal-common';
import { HttpClient } from '@angular/common/http';
import { HttpLoadingService } from 'src/app/core/https/http-loading.service';

interface selected {
    id: number;
}

@Component({
    selector: 'app-update-product',
    templateUrl: './update-product.component.html',
    styleUrl: './update-product.component.scss',
    providers: [MessageService],
})
export class UpdateProductComponent implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable!: Table;
    @ViewChild('videoInput') videoInput!: ElementRef;
    @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
    imageUrl: string = environment.baseApiUrl;
    items: MenuItem[] | undefined;
    cols!: any[];
    selectedUnit: any = null;
    error: any;
    selectedVideo: File | null = null;
    selectedParent: number = 0;
    showSubcategories: boolean = false;
    isVideoValid = true;
    videoUrl: any = null;
    videoDuration!: string | null;
    isFullScreen: boolean = false;
    isEditing: boolean = false;
    videoSelected: boolean = false;
    maxImages: number = 9;
    base64_FileVideo: string | null = null;
    base64_FileImage: string | null = null;
    base64_FileIamges: { file: File; preview: string }[] = [];
    productVariants: any[] = [];
    showPropertiesInput: boolean[] = [true];
    generateNewInput: boolean = false;
    isInputVisible = true;
    isInputVisible2 = true;
    formattedPrice: string | null = null;
    formattedPriceSale: string | null = null;
    isSerialProduct: boolean = false;
    formattedSellingPrice: string | null = null;
    formattedImPrice: string | null = null;
    formattedPrices: string[][] = [];
    isEditMode = false;
    isEditMode2 = false;
    isEditMode3: boolean[][] = [];
    showDialog3 = false;

    productForm!: FormGroup;
    selectedCategory: TreeNode | null = null;
    parentCategories: TreeNode[] | null = null;
    categorieandchild: TreeNode[] = [];
    brands: Brand[] = [];
    selectedBrand: selected | null = null;
    selectedCollection: selected | null = null;
    messages: any[] = [];
    isCategorySelected: boolean = false;
    isTreeSelectFocused: boolean = false;
    showNameError: boolean = false;
    showNameError2: boolean = false;
    showNameError3: boolean = false;
    showNameError4: boolean = false;
    showNameError5: boolean = false;
    showNameError6: boolean = false;
    showNameError7: boolean = false;
    showNameError8: boolean = false;
    showNameError9: boolean = false;
    showNameError10: boolean = false;
    showNameError11: boolean = false;
    showNameError12 = false;
    showNameError13 = false;
    showNameError14 = false;
    showNameError15 = false;
    showWarrantyError = false;
    errorMessage = '';
    errorMessage2 = '';
    errorMessage3 = '';
    showNameErrorAll: any[] = [];
    isBrandSelected: boolean = false;
    addVariants: boolean = false;
    isSubmitting: boolean = false;
    imageSelected: boolean[] = [];
    validationMessage: string | null = null;
    addVariants2: boolean = false;
    buttonVariants: boolean = true;
    buttonVariants2: boolean = true;
    showDescriptionEditor = false;
    data: any[] = [{}];
    isWarrantyApplied: boolean = false; // Trạng thái công tắc
    warrantyOptions: any[] = [];
    productId!: number;
    productById: any = {};
    productImages: { id: number; link: string }[] = [];
    showProperties1Section: boolean = false;
    showProperties1Section2: boolean = false;
    imageCache: { [index: number]: string } = {};
    imagesToDelete: number[] = [];
    barcodes: string[] = []; // To store the list of all entered barcodes
    duplicateBarcodeError: boolean = false; // To track if there are duplicate barcodes
    errorMessageCheck: string = 'Trùng mã Barcode'; // Error message for duplicates
    skus: string[] = []; // To store the list of all entered barcodes
    duplicateSkuError: boolean = false; // To track if there are duplicate barcodes
    errorMessageSku: string = 'Trùng mã Sku'; // Error message for duplicates
    duplicateBarcode: boolean = false; // To track if there are duplicate barcodes
    errorMessageBarcode: string = 'Mã vạch trùng với mã vạch sản phẩm';
    duplicateSKU: boolean = false; // To track if there are duplicate barcodes
    errorMessageSKU: string = 'Mã sku trùng với mã sku sản phẩm';
    barcodeErrors: { [key: string]: boolean } = {};
    skuErrors: { [key: string]: boolean } = {};

    constructor(
        private fb: FormBuilder,
        private brandService: BrandService,
        private categoryService: CategoryService,
        private productService: ProductService,
        // private warrantyService: WarrantyPolicyService,
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpLoadingService,
        private httpdelete: HttpClient,
        private messageService: MessageService
    ) {
        this.productForm = this.fb.group({
            id: ['', Validators.required],
            name: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(101),
                    this.validateName.bind(this),
                ]),
            ],
            description: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(500),
                ]),
            ],
            price: [null, [Validators.required, Validators.min(0)]],
            sellingPrice: [null, [Validators.required, Validators.min(1)]],
            importPrice: [null, [Validators.required, Validators.min(1)]],
            totalQuantity: [null, [Validators.required]],
            categoryId: [null, [Validators.required]],
            brandId: [null, [Validators.required]],
            brandName: [null, [Validators.required]],
            collectionId: [null],
            barcode: [null],
            sku: [null],
            mass: [null, [Validators.required, Validators.min(0.01)]],
            warrantyPolicyId: [null, [Validators.required]],
            productType: [0],
            base64_FileIamges: [[], [Validators.required]],
            base64_FileVideo: [null, []],
            propeties1: [null, Validators.required],
            propeties2: [null, Validators.required],
            valuePropeties1: this.fb.array([]),
            valuePropeties2: this.fb.array([]),
            globalPrice: [null, [Validators.required, Validators.min(0)]],
            globalWare: [null, Validators.required],
            base64_FileImage: ['', [Validators.required]],
            status: new FormControl<boolean>(true),
            unit: ['kg'],
            warning: [false],
            numberDay: [{ value: '', disabled: true }, Validators.required],
            unitName: [null],
        });

        this.initEditModes();

        for (let i = 0; i < this.valueProperties1Array.length; i++) {
            this.productForm.addControl(
                `sku${i}`,
                this.fb.control(0, [Validators.required, Validators.min(0)])
            );
            this.productForm.addControl(
                `barcode${i}`,
                this.fb.control(0, [Validators.required, Validators.min(0)])
            );
            this.productForm.addControl(
                `price${i}`,
                this.fb.control(0, [Validators.required, Validators.min(0)])
            );
            this.productForm.addControl(
                `quantity${i}`,
                this.fb.control(0, Validators.required)
            );
            this.productForm.addControl(
                `base64_FileImage${i}`,
                this.fb.control('')
            );
            for (let j = 0; j < this.valueProperties2Array.length; j++) {
                this.productForm.addControl(
                    this.getSkuControlName(i, j),
                    this.fb.control('', Validators.required)
                );
                this.productForm.addControl(
                    this.getBarcodeControlName(i, j),
                    this.fb.control('', Validators.required)
                );
                this.productForm.addControl(
                    this.getPriceControlName(i, j),
                    this.fb.control('', [
                        Validators.required,
                        Validators.min(0),
                    ])
                );
                this.productForm.addControl(
                    this.getWareControlName(i, j),
                    this.fb.control('', Validators.required)
                );
            }
        }

        this.updateProperties1Header();
        this.updateProperties2Header();
    }

    ngOnInit() {
        this.items = [
            { icon: 'pi pi-home', route: '/installation' },
            { label: 'Sản phẩm' },
            { label: 'Cập nhật' },
        ];
        this.getAllBrands();
        this.getCategoriesAndChild();
        this.setDefaultCategory();
        this.CallSnaphot();
        this.FillDataGetById();

        this.productForm.get('productType').valueChanges.subscribe((value) => {
            if (value === 1) {
                // Nếu chọn sản phẩm Serial/iMei thì đặt totalQuantity về null
                this.productForm.get('totalQuantity').setValue(null);
            }
        });

        this.productForm
            .get('sellingPrice')
            ?.valueChanges.subscribe((newSellingPrice) => {
                if (this.addVariants) {
                    this.updatePriceControls(newSellingPrice);
                }
            });

        this.productForm
            .get('totalQuantity')
            ?.valueChanges.subscribe((newTotalQuantity) => {
                if (this.addVariants) {
                    this.updateWareControls(newTotalQuantity);
                }
            });
    }

    CallSnaphot(): void {
        this.productId = +this.route.snapshot.paramMap.get('id')!;
    }

    FillDataGetById(): void {
        this.productService
            .getProductbyId(this.productId)
            .subscribe((response: any) => {
                this.productById = response.data;
                this.productImages = this.productById.productImages;

                const organizedVariants = this.organizeVariantsByProperties(
                    this.productById.productVariants
                );

                this.productForm.patchValue({
                    id: this.productById.id,
                    name: this.productById.name,
                    code: this.productById.code,
                    sku: this.productById.sku,
                    mass: this.productById.mass,
                    description: this.productById.description,
                    brandId: this.productById.brandId,
                    brandName: this.productById.brandName,
                    warrantyPolicyId: this.productById.warrantyPolicyId,
                    collectionId: this.productById.collectionId,
                    categoryId: this.productById.categoryId,
                    barcode: this.productById.barcode,
                    linkVideo: this.productById.linkVideo || undefined,
                    base64_FileVideo1:
                        this.productById.base64_FileVideo || null,
                    base64_FileVideo: this.productById.base64_FileVideo || null,
                    sellingPrice: this.productById.sellingPrice,
                    importPrice: this.productById.importPrice,
                    totalQuantity: this.productById.totalQuantity,
                    price: this.productById.price,
                    width: this.productById.width,
                    hight: this.productById.hight,
                    length: this.productById.length,
                    status: this.productById.status,
                    productType: this.productById.productType,
                    warning: this.productById.warning,
                    numberDay: this.productById.numberDay,
                    version: this.productById.version,
                    unitName: this.productById.unitName,
                    base64_FileIamges: this.productById.base64_FileIamges,
                    base64_FileIamge: this.productById.base64_FileIamge,
                    propeties1:
                        this.productById.productVariants[0]?.propeties1 || '',
                    propeties2:
                        this.productById.productVariants[0]?.propeties2 || '',
                    sku1: this.productById.productVariants[0]?.sku || '',
                    globalPrice: [''],
                    globalWare: [''],
                });

                this.setDefaultCategory();

                // this.disableSerialOption();

                if (this.productById.status === 1) {
                    this.productForm.get('status')?.setValue(true);
                } else {
                    this.productForm.get('status')?.setValue(false);
                }

                // if (this.productById.productType === 1) {
                //   this.productForm.get('productType')?.disable();
                // } else {
                //   this.productForm.get('productType')?.enable();
                // }

                this.FillWarrantySwitchChange();

                // this.checkStockDataAndDisableSerial();

                const prices: number[] = this.productById.productVariants.map(
                    (variant: any) => variant.price
                ); // Lấy mảng giá tiền từ các biến thể sản phẩm
                const quantities: number[] =
                    this.productById.productVariants.map(
                        (variant: any) => variant.quantity
                    ); // Lấy mảng giá tiền từ các biến thể sản phẩm

                const valueProperties1Array = this.productForm.get(
                    'valuePropeties1'
                ) as FormArray;
                const valueProperties2Array = this.productForm.get(
                    'valuePropeties2'
                ) as FormArray;

                organizedVariants.forEach((variantGroup: any) => {
                    variantGroup.variants.forEach(
                        (variant: any, variantIndex: number) => {
                            if (
                                !valueProperties1Array.value.includes(
                                    variant.valuePropeties1
                                )
                            ) {
                                valueProperties1Array.push(
                                    this.fb.control(variant.valuePropeties1)
                                );
                            }
                            if (
                                !valueProperties2Array.value.includes(
                                    variant.valuePropeties2
                                )
                            ) {
                                valueProperties2Array.push(
                                    this.fb.control(variant.valuePropeties2)
                                );
                            }

                            this.showProperties1Section = true;
                            this.showProperties1Section2 = true;
                            this.buttonVariants = false;
                            this.buttonVariants2 = false;

                            const index = valueProperties1Array.length - 1;

                            this.productForm.addControl(
                                `base64_FileImage${index}`,
                                this.fb.control('')
                            );
                            this.productForm.addControl(
                                this.getPriceControlName(index, variantIndex),
                                this.fb.control(
                                    variant.price,
                                    Validators.required
                                )
                            );
                            this.productForm.addControl(
                                this.getWareControlName(index, variantIndex),
                                this.fb.control(
                                    variant.quantity,
                                    Validators.required
                                )
                            );
                            this.productForm.addControl(
                                this.getSkuControlName(index, variantIndex),
                                this.fb.control(
                                    variant.sku,
                                    Validators.required
                                )
                            );
                            this.productForm.addControl(
                                this.getBarcodeControlName(index, variantIndex),
                                this.fb.control(
                                    variant.barcode,
                                    Validators.required
                                )
                            );
                        }
                    );
                });
            });
        // this.loadCategoriesAndChild();
    }

    // checkStockDataAndDisableSerial(): void {
    //     const productType = this.productById.productType;
    //     const productCode = this.productById.code;
    //     this.productService
    //         .getStockDetailsByProductCode(productCode)
    //         .subscribe((apiResponse: any) => {
    //             const hasData = apiResponse.data.length > 0;
    //             const wareQuantities = this.productById.productVariants.map(
    //                 (variant: any) => variant.quantity
    //             );
    //             const variantHasQuantity = wareQuantities.some(
    //                 (q: number) => q > 0
    //             );

    //             if (productType === 0 && (variantHasQuantity || hasData)) {
    //                 // Auto-select "Sản phẩm thường" and disable "Sản phẩm Serial/iMei"
    //                 this.productForm.get('productType')?.setValue(0);
    //                 this.productForm.get('productType')?.disable();
    //             }
    //             // Logic for productType = 1 (Sản phẩm Serial/iMei)
    //             else if (productType === 1 && hasData) {
    //                 // Auto-select "Sản phẩm Serial/iMei" and disable "Sản phẩm thường"
    //                 this.productForm.get('productType')?.setValue(1);
    //                 this.productForm.get('productType')?.disable();
    //             }
    //             // If no specific condition is met, allow both options
    //             else {
    //                 this.productForm.get('productType')?.enable();
    //             }
    //         });
    // }

    disableSerialOption(stockData: any[] = []): void {
        const totalQuantity = this.productForm.get('totalQuantity')?.value;
        const wareQuantities = this.productById.productVariants.map(
            (variant: any) => variant.quantity
        );

        const isDisabled =
            totalQuantity > 0 ||
            wareQuantities.some((q: number) => q > 0) ||
            stockData.length > 0;

        if (isDisabled) {
            this.productForm.get('productType')?.disable();
        } else {
            this.productForm.get('productType')?.enable();
        }
    }

    setDefaultCategory(): void {
        const defaultCategoryId = this.productForm.get('categoryId')?.value;
        if (defaultCategoryId) {
            // Find and set the category
            this.findCategory(defaultCategoryId, this.categorieandchild);
        }
    }

    formatCurrencySell() {
        const sellprice = this.productForm.get('sellingPrice')?.value;
        const formattedSellPrice = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(sellprice);
        this.productForm.patchValue({ sellingPrice: formattedSellPrice });
    }

    formatCurrencyIm() {
        const imprice = this.productForm.get('importPrice')?.value;
        const formattedImPrice = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(imprice);
        this.productForm.patchValue({ importPrice: formattedImPrice });
    }

    findCategory(id: number, nodes: TreeNode[]): void {
        for (const node of nodes) {
            if (node.data.id === id) {
                this.selectedCategory = node;
                break;
            }
            if (node.children) {
                this.findCategory(id, node.children);
            }
        }
    }

    openDialog3(): void {
        this.showDialog3 = true;
    }

    closeDialog3() {
        this.showDialog3 = false;
    }

    organizeVariantsByProperties(variants: any[]): any[] {
        const organizedVariants: any[] = [];
        const uniqueProperties = [
            ...new Set(variants.map((variant) => variant.valuePropeties1)),
        ];

        uniqueProperties.forEach((property) => {
            const filteredVariants = variants.filter(
                (variant) => variant.valuePropeties1 === property
            );
            organizedVariants.push({ property, variants: filteredVariants });
        });

        return organizedVariants;
    }

    onInput1(event: Event) {
        const input = (event.target as HTMLInputElement).value;
        if (input) {
            this.showNameError12 = false; // Ẩn thông báo lỗi khi người dùng nhập dữ liệu
        }
    }

    onInput2(event: Event) {
        const input = (event.target as HTMLInputElement).value;
        if (input) {
            this.showNameError14 = false; // Ẩn thông báo lỗi khi người dùng nhập dữ liệu
        }
    }

    onInput3(event: Event) {
        const input = (event.target as HTMLInputElement).value;
        if (input) {
            this.showNameError15 = false; // Ẩn thông báo lỗi khi người dùng nhập dữ liệu
        }
    }

    convertToCurrency() {
        const sellingPriceValue = this.productForm.get('sellingPrice')?.value;
        if (sellingPriceValue) {
            // Chuyển đổi sang định dạng tiền VND
            this.formattedSellingPrice = this.formatCurrency(sellingPriceValue);
            this.isEditMode = false; // Sau khi chuyển sang currency thì tắt chế độ chỉnh sửa
        }
    }

    convertToCurrency2() {
        const imPriceValue = this.productForm.get('importPrice')?.value;
        if (imPriceValue) {
            // Chuyển đổi sang định dạng tiền VND
            this.formattedImPrice = this.formatCurrency(imPriceValue);
            this.isEditMode2 = false; // Sau khi chuyển sang currency thì tắt chế độ chỉnh sửa
        }
    }

    convertPriceToCurrency(i: number, j: number) {
        const controlName = this.getPriceControlName(i, j);
        const priceValue = this.productForm.get(controlName)?.value;

        if (priceValue) {
            this.formattedPrices[i][j] = this.formatCurrency(priceValue);
            this.isEditMode3[i][j] = false; // Ẩn chế độ chỉnh sửa sau khi chuyển đổi
        }
    }

    initEditModes() {
        // Giả sử bạn có một cấu trúc lặp lại với các giá trị `i` và `j`, cần khởi tạo các trạng thái ban đầu
        for (let i = 0; i < 10; i++) {
            this.formattedPrices[i] = [];
            this.isEditMode3[i] = [];
            for (let j = 0; j < 5; j++) {
                this.formattedPrices[i][j] = null; // Ban đầu chưa có giá trị formatted
                this.isEditMode3[i][j] = true; // Ban đầu là chế độ chỉnh sửa
            }
        }
    }

    toggleEditMode3(i: number, j: number) {
        this.isEditMode3[i][j] = !this.isEditMode3[i][j];
    }

    formatCurrency(value: number): string {
        // Sử dụng hàm quốc tế hóa số để định dạng tiền tệ VND
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
    }

    toggleEditMode2() {
        this.isEditMode2 = !this.isEditMode2;
    }

    getLinkImage(index: number): string | null {
        const propertyValue =
            this.productForm.get('valuePropeties1')!.value[index];

        // Lưu trữ ảnh vào một đối tượng cache để tái sử dụng
        if (!this.imageCache[index]) {
            const variant = this.productById.productVariants.find(
                (variant: any) => variant.valuePropeties1 === propertyValue
            );
            if (variant && variant.linkImage) {
                this.imageCache[index] =
                    this.imageUrl + `/api/files/images/${variant.linkImage}`;
            }
        }

        return this.imageCache[index] || null;
    }

    FillWarrantySwitchChange() {
        if (this.productById.warning === 1) {
            this.productForm.get('warning')?.setValue(true); // Bật công tắc
            this.isWarrantyApplied = true;
            this.loadWarrantyPolicies(); // Tải chính sách bảo hành nếu cần
        } else {
            this.productForm.get('warning')?.setValue(false); // Tắt công tắc
            this.isWarrantyApplied = false;
        }

        if (this.productById.status === 1) {
            this.productForm.get('status')?.setValue(true);
        } else {
            this.productForm.get('status')?.setValue(false);
        }
    }

    onWarrantySwitchChange(event: any) {
        this.isWarrantyApplied = event.checked;

        if (this.isWarrantyApplied) {
            this.loadWarrantyPolicies();
        } else {
            this.productForm.get('warrantyPolicyId')?.reset();
        }
    }

    loadWarrantyPolicies() {
        // this.warrantyService
        //     .getWarrantyPolicies()
        //     .subscribe((response: any) => {
        //         this.warrantyOptions = response.data.items.map(
        //             (option: any) => {
        //                 return {
        //                     ...option,
        //                     shortenedName: this.shortenName(option.name, 30), // Giới hạn độ dài tên
        //                 };
        //             }
        //         );
        //     });
    }

    shortenName(name: string, maxLength: number): string {
        if (name.length > maxLength) {
            return name.slice(0, maxLength) + '...'; // Cắt ngắn và thêm ...
        }
        return name;
    }

    updatePriceControls(newPrice: string) {
        if (!this.addVariants) {
            return;
        }

        this.valueProperties1Array.controls.forEach((control, i) => {
            this.valueProperties2Array.controls.forEach((subControl, j) => {
                const priceControlName = this.getPriceControlName(i, j);
                const priceControl = this.productForm.get(priceControlName);

                if (priceControl) {
                    priceControl.setValue(newPrice);
                }
            });
        });
    }

    validateName(control: AbstractControl): { [key: string]: any } | null {
        const value = control.value as string;
        let startIndex = 0;
        let endIndex = value.length - 1;

        while (
            startIndex < value.length &&
            (value[startIndex] === ' ' || value[startIndex] === '')
        ) {
            startIndex++;
        }

        while (
            endIndex >= 0 &&
            (value[endIndex] === ' ' || value[endIndex] === '')
        ) {
            endIndex--;
        }

        if (startIndex > endIndex) {
            return { invalidName: true };
        }

        const trimmedLength = endIndex - startIndex + 1;
        if (trimmedLength < 6 || trimmedLength > 101) {
            return { invalidLength: true };
        }

        return null;
    }

    updateWareControls(newWare: string) {
        if (!this.addVariants) {
            return;
        }

        this.valueProperties1Array.controls.forEach((control, i) => {
            this.valueProperties2Array.controls.forEach((subControl, j) => {
                const wareControlName = this.getWareControlName(i, j);
                const wareControl = this.productForm.get(wareControlName);

                if (wareControl) {
                    wareControl.setValue(newWare);
                }
            });
        });
    }

    toggleDescriptionEditor() {
        this.showDescriptionEditor = !this.showDescriptionEditor;
    }

    preventNegative(event: KeyboardEvent): void {
        if (event.key === '-' || event.key === 'e') {
            event.preventDefault();
        }
    }

    onKeyPress(event: KeyboardEvent) {
        const inputChar = event.key;
        if (!this.isNumberOrDecimalKey(inputChar, event.target!)) {
            event.preventDefault();
        }
    }

    isNumberOrDecimalKey(
        inputChar: string,
        inputElement: EventTarget
    ): boolean {
        const input = (inputElement as HTMLInputElement).value;

        // Allow digits and one decimal point, but prevent more than one decimal point
        if (inputChar === '.' && input.includes('.')) {
            return false;
        }

        // Allow digits and decimal point
        return /^[0-9.]$/.test(inputChar);
    }

    getAllBrands(): void {

        this.brandService.getAllBrands().subscribe(
            (brands: any) => {
                this.brands = brands.data.items;
                console.log('selectbrand', this.brands);
            },
            (error) => {
                console.error('Error fetching brands:', error);
            }
        );
    }

    // getAllCols(): void {
    //     this.collectionService.getAllCols().subscribe(
    //         (cols) => {
    //             this.cols = cols;
    //             console.log('selectbrand', this.cols);
    //         },
    //         (error) => {
    //             console.error('Error fetching brands:', error);
    //         }
    //     );
    // }

    getCategoriesAndChild() {
        this.categoryService.getCategoriesAndChild().subscribe(
            (response) => {
                this.categorieandchild = response;
                this.setDefaultCategory();
            },
            (error) => {
                console.error('Error fetching categories:', error);
            }
        );
    }

    getAllSubcategoriesRecursive(parentCategory: TreeNode) {
        this.categoryService.getSubcategories(parentCategory.data.id).subscribe(
            (response) => {
                parentCategory.children = response.data.map((category: any) =>
                    this.mapToTreeNode(category)
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
            children: undefined,
        };
    }

    onNodeSelect(event: any) {
        const selectedNode = event.node;
        this.selectedCategory = selectedNode;
        if (!selectedNode.data.parentId) {
            if (!selectedNode.children) {
                this.getAllSubcategoriesRecursive(selectedNode);
            }
        }
    }

    onNodeUnselect(event: any) {
        const unselectedNode = event.node;
        if (this.selectedCategory === unselectedNode) {
            this.selectedCategory = null;
        }
        unselectedNode.children = null;
    }

    onTreeSelectFocus() {
        this.isTreeSelectFocused = true;
    }

    onKeyPressQuantity(event: KeyboardEvent) {
        const inputChar = event.key;
        if (!this.isNumberOrDecimalKey(inputChar, event.target!)) {
            event.preventDefault();
        }
        if (inputChar === 'Enter') {
            this.updateWareControls(
                this.productForm.get('totalQuantity')?.value
            );
        }
    }

    onKeyPressPrice(event: KeyboardEvent) {
        const inputChar = event.key;
        if (!this.isNumberOrDecimalKey(inputChar, event.target!)) {
            event.preventDefault();
        }
        if (inputChar === 'Enter') {
            this.updatePriceControls(
                this.productForm.get('sellingPrice')?.value
            );
        }
    }

    addProperty1(): void {
        this.valueProperties1Array.push(this.fb.control(''));
        // Thêm ô input price cho giá trị mới của valueProperties1
        const index = this.valueProperties1Array.length - 1;
        this.productForm.addControl(
            `sku${index}`,
            this.fb.control('', Validators.required)
        );
        this.productForm.addControl(
            `barcode${index}`,
            this.fb.control('', Validators.required)
        );
        this.productForm.addControl(
            `price${index}`,
            this.fb.control('', Validators.required)
        );
        this.productForm.addControl(
            `quantity${index}`,
            this.fb.control('', Validators.required)
        );
        this.productForm.addControl(
            `base64_FileImage${index}`,
            this.fb.control('')
        );

        const sampleImage = ''; // Dùng ảnh mẫu hoặc rỗng
        this.productForm.get(`base64_FileImage${index}`)!.setValue(sampleImage);
        // Thêm ô input price cho từng valueProperties2 của valueProperties1 mới
        for (let j = 0; j < this.valueProperties2Array.length; j++) {
            this.productForm.addControl(
                this.getSkuControlName(index, j),
                this.fb.control('', Validators.required)
            );
            this.productForm.addControl(
                this.getBarcodeControlName(index, j),
                this.fb.control('', Validators.required)
            );
            this.productForm.addControl(
                this.getPriceControlName(index, j),
                this.fb.control('', Validators.required)
            );
            this.productForm.addControl(
                this.getWareControlName(index, j),
                this.fb.control('', Validators.required)
            );
        }

        this.productForm
            .get('sellingPrice')
            ?.valueChanges.subscribe((newSellingPrice) => {
                if (this.addVariants) {
                    this.updatePriceControls(newSellingPrice);
                }
            });

        this.productForm
            .get('totalQuantity')
            ?.valueChanges.subscribe((newTotalQuantity) => {
                if (this.addVariants) {
                    this.updateWareControls(newTotalQuantity);
                }
            });
    }

    addProperty2(): void {
        this.valueProperties2Array.push(this.fb.control(''));
        // Thêm ô input price cho từng valueProperties1
        for (let i = 0; i < this.valueProperties1Array.length; i++) {
            this.productForm.addControl(
                this.getSkuControlName(
                    i,
                    this.valueProperties2Array.length - 1
                ),
                this.fb.control('', Validators.required)
            );
            this.productForm.addControl(
                this.getBarcodeControlName(
                    i,
                    this.valueProperties2Array.length - 1
                ),
                this.fb.control('', Validators.required)
            );
            this.productForm.addControl(
                this.getPriceControlName(
                    i,
                    this.valueProperties2Array.length - 1
                ),
                this.fb.control('', Validators.required)
            );
            this.productForm.addControl(
                this.getWareControlName(
                    i,
                    this.valueProperties2Array.length - 1
                ),
                this.fb.control('', Validators.required)
            );
        }
    }

    removeProperty1(index: number): void {
        // Xóa valueProperties1 khỏi mảng
        const deletedValue1 = this.valueProperties1Array.at(index).value;

        // Đánh dấu các biến thể sản phẩm tương ứng đã bị xóa
        for (let i = 0; i < this.productById.productVariants.length; i++) {
            const variant = this.productById.productVariants[i];
            if (variant.valuePropeties1 === deletedValue1) {
                variant.isDeleted = 1;
            }
        }

        this.valueProperties1Array.removeAt(index);
        this.productForm.removeControl(`sku${index}`);
        this.productForm.removeControl(`barcode${index}`);
        this.productForm.removeControl(`price${index}`);
        this.productForm.removeControl(`quantity${index}`);
        for (let j = 0; j < this.valueProperties2Array.length; j++) {
            this.productForm.removeControl(this.getSkuControlName(index, j));
            this.productForm.removeControl(
                this.getBarcodeControlName(index, j)
            );
            this.productForm.removeControl(this.getPriceControlName(index, j));
            this.productForm.removeControl(this.getWareControlName(index, j));
        }
        for (let i = index; i < this.valueProperties1Array.length; i++) {
            const skuControl = this.productForm.get(`sku${i + 1}`);
            const barcodeControl = this.productForm.get(`barcode${i + 1}`);
            const priceControl = this.productForm.get(`price${i + 1}`);
            const wareControl = this.productForm.get(`quantity${i + 1}`);
            this.productForm.removeControl(`sku${i + 1}`);
            this.productForm.addControl(`sku${i}`, skuControl);
            this.productForm.removeControl(`barcode${i + 1}`);
            this.productForm.addControl(`barcode${i}`, barcodeControl);
            this.productForm.removeControl(`price${i + 1}`);
            this.productForm.addControl(`price${i}`, priceControl);
            this.productForm.removeControl(`quantity${i + 1}`);
            this.productForm.addControl(`quantity${i}`, wareControl);
            for (let j = 0; j < this.valueProperties2Array.length; j++) {
                const control1 = this.productForm.get(
                    this.getSkuControlName(i + 1, j)
                );
                const control2 = this.productForm.get(
                    this.getBarcodeControlName(i + 1, j)
                );
                const control3 = this.productForm.get(
                    this.getPriceControlName(i + 1, j)
                );
                const control4 = this.productForm.get(
                    this.getWareControlName(i + 1, j)
                );
                this.productForm.removeControl(
                    this.getSkuControlName(i + 1, j)
                );
                this.productForm.addControl(
                    this.getSkuControlName(i, j),
                    control1
                );
                this.productForm.removeControl(
                    this.getBarcodeControlName(i + 1, j)
                );
                this.productForm.addControl(
                    this.getBarcodeControlName(i, j),
                    control2
                );
                this.productForm.removeControl(
                    this.getPriceControlName(i + 1, j)
                );
                this.productForm.addControl(
                    this.getPriceControlName(i, j),
                    control3
                );
                this.productForm.removeControl(
                    this.getWareControlName(i + 1, j)
                );
                this.productForm.addControl(
                    this.getWareControlName(i, j),
                    control4
                );
            }
        }
    }

    removeProperty2(index: number): void {
        this.valueProperties2Array.removeAt(index);
        // Xóa ô input price của từng valueProperties1
        for (let i = 0; i < this.valueProperties1Array.length; i++) {
            this.productForm.removeControl(this.getSkuControlName(i, index));
            this.productForm.removeControl(
                this.getBarcodeControlName(i, index)
            );
            this.productForm.removeControl(this.getPriceControlName(i, index));
            this.productForm.removeControl(this.getWareControlName(i, index));
        }
        // Sau khi xóa, cập nhật lại các key của input price
        for (let i = 0; i < this.valueProperties1Array.length; i++) {
            for (let j = index; j < this.valueProperties2Array.length; j++) {
                const control1 = this.productForm.get(
                    this.getSkuControlName(i + 1, j)
                );
                const control2 = this.productForm.get(
                    this.getBarcodeControlName(i + 1, j)
                );
                const control3 = this.productForm.get(
                    this.getPriceControlName(i + 1, j)
                );
                const control4 = this.productForm.get(
                    this.getWareControlName(i + 1, j)
                );
                this.productForm.removeControl(
                    this.getSkuControlName(i + 1, j)
                );
                this.productForm.addControl(
                    this.getSkuControlName(i, j),
                    control1
                );
                this.productForm.removeControl(
                    this.getBarcodeControlName(i + 1, j)
                );
                this.productForm.addControl(
                    this.getBarcodeControlName(i, j),
                    control2
                );
                this.productForm.removeControl(
                    this.getPriceControlName(i + 1, j)
                );
                this.productForm.addControl(
                    this.getPriceControlName(i, j),
                    control3
                );
                this.productForm.removeControl(
                    this.getWareControlName(i + 1, j)
                );
                this.productForm.addControl(
                    this.getWareControlName(i, j),
                    control4
                );
            }
        }
    }

    updateProperties1Header(): void {
        let properties1Value = this.productForm.get('propeties1')!.value;
        if (!properties1Value) {
            properties1Value = 'Giá trị thuộc tính 1';
        }
        const properties1HeaderElement =
            document.getElementById('propeties1Header');
        if (properties1HeaderElement) {
            properties1HeaderElement.innerText = properties1Value;
        }
    }

    updateProperties2Header(): void {
        let properties2Value = this.productForm.get('propeties2')!.value;
        if (!properties2Value) {
            properties2Value = 'Giá trị thuộc tính 2';
        }
        const properties2HeaderElement =
            document.getElementById('propeties2Header');
        if (properties2HeaderElement) {
            properties2HeaderElement.innerText = properties2Value;
        }
    }

    onImageSelected(event: any): void {
        const maxFileSize = 3 * 1024 * 1024;
        const maxAllowedImages = 9;

        const files: FileList = event.target.files;
        if (files.length > 0) {
            this.showNameError = false;
        }

        const totalImages = this.base64_FileIamges.length + files.length;

        if (totalImages > maxAllowedImages) {
            this.messages = [
                {
                    severity: 'warn',
                    summary: 'Số lượng ảnh vượt quá giới hạn',
                    detail: `Chỉ được phép tải lên tối đa ${maxAllowedImages} ảnh`,
                    life: 3000,
                },
            ];
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > maxFileSize) {
                this.messages = [
                    {
                        severity: 'warn',
                        summary: 'Ảnh > 3MB',
                        detail: 'Ảnh tải lên không được lớn hơn 3MB',
                        life: 3000,
                    },
                ];
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                this.base64_FileIamges.push({ file, preview: base64String });
                this.productForm
                    .get('base64_FileIamges')
                    ?.setValue(
                        this.base64_FileIamges.map(
                            (image) => image.preview.split(',')[1]
                        )
                    );
            };
            reader.readAsDataURL(file);
        }
        this.imageInput.nativeElement.value = '';
    }

    removeImage(index: number): void {
        this.base64_FileIamges.splice(index, 1);
        this.productForm
            .get('base64_FileIamges')
            ?.setValue(
                this.base64_FileIamges.map(
                    (image) => image.preview.split(',')[1]
                )
            );
    }

    onSwitchChange(event: any) {
        if (event.checked) {
            this.productForm.get('numberDay')?.enable();
        } else {
            this.productForm.get('numberDay')?.disable();
        }
    }

    get valueProperties1Array(): FormArray {
        return this.productForm.get('valuePropeties1') as FormArray;
    }

    get valueProperties2Array(): FormArray {
        return this.productForm.get('valuePropeties2') as FormArray;
    }

    getPriceControlName(i: number, j: number): string {
        return `price${i}-${j}`;
    }

    getWareControlName(i: number, j: number): string {
        return `quantity${i}-${j}`;
    }

    getBarcodeControlName(i: number, j: number): string {
        return `barcode${i}-${j}`;
    }

    getSkuControlName(i: number, j: number): string {
        return `sku${i}-${j}`;
    }

    applyGlobalPrice(): void {
        // Lấy giá trị của globalPrice từ biểu mẫu
        const globalPrice = this.productForm.get('globalPrice')!.value;
        const globalWare = this.productForm.get('globalWare')!.value;

        // Đặt giá trị của globalPrice vào tất cả các ô input price
        for (let i = 0; i < this.valueProperties1Array.length; i++) {
            for (let j = 0; j < this.valueProperties2Array.length; j++) {
                this.productForm
                    .get(this.getPriceControlName(i, j))!
                    .setValue(globalPrice);
                this.productForm
                    .get(this.getWareControlName(i, j))!
                    .setValue(globalWare);
            }
        }
    }

    openAddVariants() {
        this.addVariants = true;
        this.buttonVariants = false;
        this.productForm.get('price')?.setValue(null);
        this.productForm.get('totalQuantity')?.setValue(null);
        this.addProperty1();
        // this.productForm.get('price')?.setValue(0);
        // this.productForm.get('totalQuantity')?.setValue(0);
    }

    openAddVariants2() {
        this.addVariants2 = true;
        this.buttonVariants2 = false;
        this.addProperty2();
    }

    closeAddVariants() {
        this.addVariants = false;
        this.productForm.get('propeties1')?.reset();
        this.productForm.get('valuePropeties1')?.reset();
        this.productForm.get('globalPrice')?.reset();
        this.productForm.get('globalWare')?.reset();
        this.productForm.get('base64_FileImage')?.reset();
        for (let i = 0; i < this.valueProperties1Array.controls.length; i++) {
            // Loop through the second array (valueProperties2Array)
            for (
                let j = 0;
                j < this.valueProperties2Array.controls.length;
                j++
            ) {
                // Clear the Price control
                const priceControl = this.getPriceControlName(i, j);
                if (priceControl) {
                    this.productForm.get(priceControl)?.reset(); // or setValue('') if you want an empty string
                }

                // Clear the Barcode control
                const barcodeControl = this.getBarcodeControlName(i, j);
                if (barcodeControl) {
                    this.productForm.get(barcodeControl)?.reset(); // or setValue('') if you want an empty string
                }

                const skuControl = this.getSkuControlName(i, j);
                if (skuControl) {
                    this.productForm.get(skuControl)?.reset(); // or setValue('') if you want an empty string
                }

                const quantityControl = this.getWareControlName(i, j);
                if (quantityControl) {
                    this.productForm.get(quantityControl)?.reset(); // or setValue('') if you want an empty string
                }
            }
        }
        this.valueProperties1Array.clear();
        // this.addProperty1();
        this.buttonVariants = true;
    }

    closeAddVariants2() {
        this.addVariants2 = false;
        this.productForm.get('propeties2')?.reset();
        this.productForm.get('valuePropeties2')?.reset();
        this.productForm.get('globalPrice')?.reset();
        this.productForm.get('globalWare')?.reset();
        this.productForm.get('base64_FileImage')?.reset();
        this.valueProperties2Array.clear();
        // this.addProperty2();
        this.buttonVariants2 = true;
    }

    closeshowProperties1() {
        this.showProperties1Section = false;
        this.productForm.get('propeties1')?.reset();
        this.productForm.get('valuePropeties1')?.reset();
        this.productForm.get('globalPrice')?.reset();
        this.productForm.get('globalWare')?.reset();
        this.productForm.get('base64_FileImage')?.reset();
        for (let i = 0; i < this.valueProperties1Array.controls.length; i++) {
            // Loop through the second array (valueProperties2Array)
            for (
                let j = 0;
                j < this.valueProperties2Array.controls.length;
                j++
            ) {
                // Clear the Price control
                const priceControl = this.getPriceControlName(i, j);
                if (priceControl) {
                    this.productForm.get(priceControl)?.reset(); // or setValue('') if you want an empty string
                }

                // Clear the Barcode control
                const barcodeControl = this.getBarcodeControlName(i, j);
                if (barcodeControl) {
                    this.productForm.get(barcodeControl)?.reset(); // or setValue('') if you want an empty string
                }

                const skuControl = this.getSkuControlName(i, j);
                if (skuControl) {
                    this.productForm.get(skuControl)?.reset(); // or setValue('') if you want an empty string
                }

                const quantityControl = this.getWareControlName(i, j);
                if (quantityControl) {
                    this.productForm.get(quantityControl)?.reset(); // or setValue('') if you want an empty string
                }
            }
        }
        this.valueProperties1Array.clear();
        // this.addProperty1();
        this.buttonVariants = true;
    }

    closeshowProperties2() {
        this.showProperties1Section2 = false;
        this.productForm.get('propeties2')?.reset();
        this.productForm.get('valuePropeties2')?.reset();
        this.productForm.get('globalPrice')?.reset();
        this.productForm.get('globalWare')?.reset();
        this.productForm.get('base64_FileImage')?.reset();
        this.valueProperties2Array.clear();
        // this.addProperty2();
        this.buttonVariants2 = true;
    }

    getBase64Image(index: number): string | null {
        const control = this.productForm.get(`base64_FileImage${index}`);
        return control ? control.value : null;
    }

    getPriceControlError(i: number, j: number) {
        const control = this.productForm.get(this.getPriceControlName(i, j));
        if (control && control.errors) {
            // if (control.errors.required) {
            //   return 'Giá không được để trống';
            // }
            if (control.errors?.['min']) {
                return 'Giá không thể nhỏ hơn 1000';
            }
        }
        return '';
    }

    onImageVariant(event: any, index: number): void {
        const file: File = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                this.base64_FileImage = base64String;
                // this.productForm.get('base64_FileIamges')?.setValue(base64String.split(',')[1]);
                this.valueProperties1Array
                    .at(index)
                    .get('base64_FileIamge')
                    ?.setValue(base64String.split(',')[1]);
            };
            reader.readAsDataURL(file);
        }
    }

    handleFileInput(event: any, index: number): void {
        const maxFileSize = 3 * 1024 * 1024;
        const file = event.target.files[0];

        if (file.size > maxFileSize) {
            this.messages = [
                {
                    severity: 'warn',
                    summary: 'Ảnh > 3MB',
                    detail: 'Ảnh tải lên không được lớn hơn 3MB',
                    life: 3000,
                },
            ];
            return;
        }

        if (file) {
            this.readFileAsBase64(file).then((result) => {
                this.productForm
                    .get(`base64_FileImage${index}`)!
                    .setValue(result);
                this.imageSelected[index] = true;
            });
        }
    }

    readFileAsBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result?.toString();
                if (base64String) {
                    resolve(base64String.split(',')[1]);
                } else {
                    reject('Failed to read file as base64.');
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }

    removeImageVariant(index: number): void {
        this.productForm.get(`base64_FileImage${index}`)!.setValue(null);
        this.imageSelected[index] = false;
        const fileInput = document.getElementById(
            `fileInput${index}`
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    }

    removeProductVariantImage(i: number): void {
        // Lấy giá trị của valuePropeties1 tại vị trí i
        const propertyValue = this.productForm.get('valuePropeties1')!.value[i];

        // Tìm index của variant có giá trị valuePropeties1 tương ứng
        const variantIndex = this.productById.productVariants.findIndex(
            (variant: any) => variant.valuePropeties1 === propertyValue
        );

        if (variantIndex !== -1) {
            // Xóa linkImage trong biến thể sản phẩm
            this.productById.productVariants[variantIndex].linkImage = null;
            // Cập nhật lại cache ảnh nếu có
            delete this.imageCache[i];
        }

        // Không cần thay đổi giá trị của valuePropeties1 trong form control
    }

    deleteImage(id: number): void {
        // Add ID to imagesToDelete array
        this.imagesToDelete.push(id);
        // Remove the image from productImages array for UI update
        this.productImages = this.productImages.filter(
            (image) => image.id !== id
        );
    }

    deleteImagesFromServer(): void {
        this.imagesToDelete.forEach((id) => {
            this.productService.deleteImage(id).subscribe(
                () => {
                    console.log(`Ảnh ${id} đã xóa thành công`);
                },
                (error) => {
                    console.error(`Error deleting image ${id}:`, error);
                }
            );
        });
    }

    uploadImages(productId: number): void {
        const formData = new FormData();
        this.base64_FileIamges.forEach((image) => {
            const base64_FileIamge = image.preview.split(',')[1];
            const json_addImage = {
                productId: productId,
                base64_image: base64_FileIamge,
            };
            this.http.post(`product/add-image`, json_addImage)
                .subscribe(
                    () => {
                        console.log('Images added successfully');
                    },
                    (error) => {
                        console.error('Error adding images:', error);
                    }
                );
        });
        console.log(this.base64_FileIamges);
    }

    checkBarcodeAndUpdate() {
        const newBarcode = this.productForm.get('barcode')!.value;
        const originalBarcode = this.productById.barcode;

        // Kiểm tra xem mã vạch có thay đổi không
        if (newBarcode === originalBarcode) {
            // Mã vạch không thay đổi, trực tiếp cập nhật sản phẩm
            this.onSubmitUpdate();
        } else {
            // Mã vạch đã thay đổi, kiểm tra mã vạch mới
            this.productService
                .checkBarcodeUpdate(newBarcode, this.productById.id)
                .subscribe(
                    (response) => {
                        if (response.data) {
                            // Mã vạch đã tồn tại
                            this.messages = [
                                {
                                    severity: 'error',
                                    summary: 'Lỗi',
                                    detail: 'Mã vạch đã tồn tại. Vui lòng sử dụng mã vạch khác.',
                                    life: 2000,
                                },
                            ];
                        } else {
                            // Mã vạch không tồn tại, tiếp tục cập nhật sản phẩm
                            this.onSubmitUpdate();
                        }
                    },
                    (error) => {
                        console.error('Lỗi khi kiểm tra mã vạch:', error);
                    }
                );
        }
    }

    checkSkuAndUpdate() {
        const newSku = this.productForm.get('sku')!.value;
        const originalSku = this.productById.sku;

        // Kiểm tra xem mã vạch có thay đổi không
        if (newSku === originalSku) {
            // Mã vạch không thay đổi, trực tiếp cập nhật sản phẩm
            this.onSubmitUpdate();
        } else {
            // Mã vạch đã thay đổi, kiểm tra mã vạch mới
            this.productService
                .checkSkuUpdate(newSku, this.productById.id)
                .subscribe(
                    (response) => {
                        if (response.data) {
                            // Mã vạch đã tồn tại
                            this.messages = [
                                {
                                    severity: 'error',
                                    summary: 'Lỗi',
                                    detail: 'Mã sku đã tồn tại. Vui lòng sử dụng mã vạch khác.',
                                    life: 2000,
                                },
                            ];
                        } else {
                            // Mã vạch không tồn tại, tiếp tục cập nhật sản phẩm
                            this.onSubmitUpdate();
                        }
                    },
                    (error) => {
                        console.error('Lỗi khi kiểm tra mã vạch:', error);
                    }
                );
        }
    }

    onBarcodeInput(event: Event, i: number, j: number): void {
        const inputElement = event.target as HTMLInputElement;
        const barcode = inputElement.value;

        // Update the barcode value in the array based on its control name
        const controlName = this.getBarcodeControlName(i, j);

        if (barcode.trim() === '') {
            // If the input is empty, remove it from the barcodes array
            this.barcodes[i * 10 + j] = null; // Assuming there are max 10 variants
        } else {
            // Otherwise, update the barcode
            this.barcodes[i * 10 + j] = barcode;
        }

        // Check for duplicates
        this.checkForDuplicateBarcodes();
    }

    checkForDuplicateBarcodes(): void {
        const filledBarcodes = this.barcodes.filter((barcode) => barcode); // Only consider non-empty barcodes
        const uniqueBarcodes = new Set(filledBarcodes);
        this.duplicateBarcodeError =
            uniqueBarcodes.size !== filledBarcodes.length;
        if (this.duplicateBarcodeError) {
            this.messages = [
                {
                    severity: 'warn',
                    summary: '',
                    detail: 'Mã vạch biến thể không được trùng nhau',
                    life: 3000,
                },
            ];
        }
    }

    checkDuplicateBarcode(newBarcode: string): boolean {
        const existingBarcode = this.productForm.get('barcode')?.value;
        const barcodes = this.valueProperties2Array.controls.map(
            (control: any) => control.value.barcode
        );
        return existingBarcode === newBarcode || barcodes.includes(newBarcode);
    }

    checkDuplicateSKU(newSku: string): boolean {
        const existingSku = this.productForm.get('sku')?.value;
        const skus = this.valueProperties2Array.controls.map(
            (control: any) => control.value.sku
        );
        return existingSku === newSku || skus.includes(newSku);
    }

    onBarcodeInput2(event: Event, i: number, j: number): void {
        const input = event.target as HTMLInputElement;
        const newBarcode = input.value;

        // Check for duplicates
        if (this.checkDuplicateBarcode(newBarcode)) {
            this.messages = [
                {
                    severity: 'warn',
                    summary: '',
                    detail: 'Mã vạch trùng với mã vạch sản phẩm',
                    life: 3000,
                },
            ];
        }
    }

    onSKUInput2(event: Event, i: number, j: number): void {
        const input = event.target as HTMLInputElement;
        const newSKU = input.value;

        // Check for duplicates
        if (this.checkDuplicateBarcode(newSKU)) {
            this.messages = [
                {
                    severity: 'warn',
                    summary: '',
                    detail: 'Mã sku trùng với mã sku sản phẩm',
                    life: 3000,
                },
            ];
        }
    }

    onSkuInput(event: Event, i: number, j: number): void {
        const inputElement = event.target as HTMLInputElement;
        const sku = inputElement.value;

        // Update the barcode value in the array based on its control name
        const controlName = this.getSkuControlName(i, j);

        if (sku.trim() === '') {
            // If the input is empty, remove it from the barcodes array
            this.skus[i * 10 + j] = null; // Assuming there are max 10 variants
        } else {
            // Otherwise, update the barcode
            this.skus[i * 10 + j] = sku;
        }

        // Check for duplicates
        this.checkForDuplicateSku();
    }

    checkForDuplicateSku(): void {
        const filledSku = this.skus.filter((sku) => sku); // Only consider non-empty barcodes
        const uniqueSku = new Set(filledSku);
        this.duplicateSkuError = uniqueSku.size !== filledSku.length;
        if (this.duplicateSkuError) {
            this.messages = [
                {
                    severity: 'warn',
                    summary: '',
                    detail: 'Mã sku biến thể không được trùng nhau',
                    life: 3000,
                },
            ];
        }
    }

    checkDuplicateBarcode2(newBarcode: string, i: number, j: number): boolean {
        const mainBarcode = this.productForm.get('barcode')?.value;

        // Get all entered barcodes from the form array
        const barcodes = this.valueProperties2Array.controls.map(
            (control: any, index: number) =>
                control.get(this.getBarcodeControlName(index, j))?.value
        );

        // Check if new barcode matches main barcode or any existing barcode except the current one
        return (
            mainBarcode === newBarcode ||
            barcodes.some(
                (barcode, index) => barcode === newBarcode && index !== i
            )
        );
    }

    checkDuplicateSku2(newSku: string, i: number, j: number): boolean {
        const mainSku = this.productForm.get('sku')?.value;

        // Get all entered barcodes from the form array
        const skus = this.valueProperties2Array.controls.map(
            (control: any, index: number) =>
                control.get(this.getSkuControlName(index, j))?.value
        );

        // Check if new barcode matches main barcode or any existing barcode except the current one
        return (
            mainSku === newSku ||
            skus.some((sku, index) => sku === newSku && index !== i)
        );
    }

    onBarcodeInput3(event: Event, i: number, j: number): void {
        const input = event.target as HTMLInputElement;
        const newBarcode = input.value;

        // Check if the barcode is a duplicate
        const isDuplicate = this.checkDuplicateBarcode2(newBarcode, i, j);

        // Update error state for this specific field
        this.barcodeErrors[`${i}-${j}`] = isDuplicate;
    }

    onSkuInput3(event: Event, i: number, j: number): void {
        const input = event.target as HTMLInputElement;
        const newSku = input.value;

        // Check if the barcode is a duplicate
        const isDuplicate = this.checkDuplicateSku2(newSku, i, j);

        // Update error state for this specific field
        this.skuErrors[`${i}-${j}`] = isDuplicate;
    }

    hasBarcodeErrors(): boolean {
        return Object.values(this.barcodeErrors).some((error) => error);
    }

    hasSkuErrors(): boolean {
        return Object.values(this.skuErrors).some((error) => error);
    }

    onSubmitUpdate(): void {
        if (this.isSubmitting) {
            return;
        }
        this.isSubmitting = true;
        const productData = this.productForm.value;

        let hasError = false;

        if (!productData.name || productData.name.length === 0) {
            this.showNameError2 = true;
            hasError = true;
        }

        if (this.hasBarcodeErrors() || this.hasSkuErrors()) {
            this.messages = [
                {
                    severity: 'warn',
                    summary: 'Lỗi',
                    detail: 'Có mã Barcode hoặc mã Sku trùng với sản phẩm',
                    life: 3000,
                },
            ];
            this.isSubmitting = false;
            return; // Prevent form submission if there are barcode errors
        }

        if (this.duplicateBarcodeError || this.duplicateSkuError) {
            this.messages = [
                {
                    severity: 'warn',
                    summary: 'Lỗi',
                    detail: 'Có mã Barcode hoặc mã Sku của biến thể bị trùng! Vui lòng nhập lại.',
                    life: 3000,
                },
            ];
            this.isSubmitting = false;
            return; // Prevent form submission
        }

        // if (!productData.name || productData.name.trim().length < 6 || productData.name.trim().length > 100) {
        //   this.showNameError10 = true;
        //   hasError = true;
        // }

        if (
            !productData.name ||
            (productData.name.length > 0 &&
                productData.name.trim().length === 0)
        ) {
            this.showNameError11 = true;
            hasError = true;
        }

        if (!productData.categoryId || productData.categoryId.length === 0) {
            this.showNameError4 = true;
            hasError = true;
        }

        if (this.duplicateBarcode) {
            hasError = true;
        }

        if (this.duplicateSKU) {
            hasError = true;
        }

        if (this.isWarrantyApplied && !productData.warrantyPolicyId) {
            this.showWarrantyError = true;
            hasError = true;
        }

        if (hasError) {
            this.messages = [
                {
                    severity: 'error',
                    summary: 'Không thể lưu vì:',
                    detail: 'Sản phẩm đang có lỗi cần được chỉnh sửa',
                    life: 5000,
                },
            ];
            this.isSubmitting = false;
            return;
        }

        const productTypeValue = this.productForm.get('productType')?.enabled
            ? productData.productType === 1
                ? 1
                : 0
            : this.productById.productType;

        const selectedBrand = this.brands.find(
            (brand) => brand.id === productData.brandId
        );
        this.productById.name = productData.name;
        this.productById.sku = productData.sku;
        this.productById.description = productData.description;
        this.productById.brandId = productData.brandId;
        this.productById.brandName = selectedBrand ? selectedBrand.name : null;
        this.productById.warrantyPolicyId = productData.warrantyPolicyId;
        this.productById.barcode = productData.barcode;
        this.productById.collectionId = productData.collectionId;
        this.productById.categoryId = this.selectedCategory?.data.id;
        this.productById.sellingPrice = productData.sellingPrice || 0;
        this.productById.importPrice = productData.importPrice || 0;
        this.productById.base64_FileIamges = productData.base64_FileIamges;
        this.productById.base64_FileVideo =
            productData.base64_FileVideo1 || null;
        this.productById.base64_FileVideo =
            productData.base64_FileVideo || null;
        // this.productById.linkVideo = productData.linkVideo || null;
        this.productById.totalQuantity = productData.totalQuantity || 0;
        this.productById.mass = productData.mass || 0;
        this.productById.width = productData.width;
        this.productById.hight = productData.hight;
        this.productById.length = productData.length;
        this.productById.status = productData.status ? 1 : 0;
        this.productById.warning = productData.warning ? 1 : 0;
        this.productById.numberDay = productData.numberDay;
        this.productById.unitName = productData.unitName;
        this.productById.createdBy = null ;
        this.productById.isDeleted = 0;
        this.productById.productType = productTypeValue;

        this.productService.updateProductAndVariant(this.productById).subscribe(
            (response) => {
                // console.log(product)
                console.log('Sản phẩm đã được sửa thành công:', response);
                this.deleteImagesFromServer();
                this.uploadImages(this.productId);
                this.messages = [
                    {
                        severity: 'success',
                        summary: 'Thành công',
                        detail: 'Sản phẩm đã được sửa thành công',
                        life: 2000,
                    },
                ];
                setTimeout(() => {
                    this.router.navigate(['/admin/pages/products/show-product']);
                    this.isSubmitting = false;
                }, 2000);

                // Xử lý phản hồi thành công
            },
            (error) => {
                console.error('Lỗi khi sửa sản phẩm:', error);
                this.isSubmitting = false;
                // Xử lý lỗi
            }
        );
    }
}
