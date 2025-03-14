export class Product {
    pageSize: number | null = 100;
    pageIndex: number | null = 1;
    name: string | null = '';
    img : string | null = '';
    sellingPrice : number ;
    importPrice : number ;
    id:number;
    productImages :string [];
    categoryId : number;
    description :string;
    status:number =1;
}

export class ProductCategoryItem {
    pageSize: number | null = 100;
    pageIndex: number | null = 1;
    name: string | null = '';
    img : string | null = '';
    sellingPrice : number ;
    importPrice : number ;
    id:number;
    productImages :string [];
    categoryId : number;
    CategoryId: number;
    KeyWord: string;
}