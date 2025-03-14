export interface Products {
    id?: number;
    name?: string;
    description?: string;
    content: string;
    price?: number | null;
    totalQuantity?: number | null;
    categoryId?: number;
    brandId?: number;
    collectionId?: number;
    width?: number | null;
    hight?: number | null;
    length?: number | null;
    unitId?: number;
    base64_FileVideo1?: string | null;
    base64_FileVideo?: string | null;
    linkVideo?: string | null;
    base64_FileIamges?: string[];
    productImages?: ProductImage[];
    productVariants: ProductVariant[];
    propeties1?: string; // Thêm dấu hỏi để đánh dấu thuộc tính có thể không bắt buộc
    valuePropeties1?: string; // Thêm dấu hỏi để đánh dấu thuộc tính có thể không bắt buộc
    propeties2?: string; // Thêm dấu hỏi để đánh dấu thuộc tính có thể không bắt buộc
    valuePropeties2?: string;
    base64_FileIamge?: string;
    linkImage?: string;
    status?: number;
    unitName?: string;
    isDeleted?: number;
}

export interface ProductVariant {
    sku?: string;
    width?: number;
    height?: number;
    length?: number;
    weight?: number;
    name?: string;
    price?: number;
    quantity?: number;
    propeties1?: string;
    productId?: number;
    valuePropeties1?: string;
    propeties2?: string;
    valuePropeties2?: string;
    base64_FileImage?: string;
    linkImage?: string;
    isDeleted?: number;
}

export interface ProductImage {
    id: number | null; // ID of the image
    link: string; // Link to the image
}

export class OptionsFilterProduct {
    pageSize: number | null = 30;
    pageIndex: number | null = 1;
    sortOrder: string | null = 'desc';
    KeyWord: string | null = null;
    CategoryId: number | null = null;
    BrandId: number | null = null;
    StartPrice: number | null = null;
    EndPrice: number | null = null;
    Status: number | null = null;
}
