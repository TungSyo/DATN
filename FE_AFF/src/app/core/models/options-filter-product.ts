export class OptionsFilterProduct {
    pageSize: number | null = 18;
    pageIndex: number | null = 1;
    productName: string | null = '';
    sortOrder: string | null = 'desc';
    KeyWord: string | null = null;
    CategoryId: number | null = null;
    StartPrice: number | null = null;
    EndPrice: number | null = null;
    Status: number | null = null;
    Barcode: string | null = '';
    BranchId: number | null = null;
    branchId: number;
}
