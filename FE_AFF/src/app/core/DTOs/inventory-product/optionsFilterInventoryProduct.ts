export class OptionsFilterInventoryProduct {
    pageSize: number | null = 10;
    pageIndex: number | null = 1;
    productName: string | null = null;
    productVariantName: string | null = null;
    branchId: number | null = null;
    fromQuantity: number | null = null;
    toQuantity: number | null = null;
    keyWord: string | null = null;
}
