export class OptionsFilterStockIn {
    pageSize: number | null = 10;
    pageIndex: number | null = 1;
    branchId: number | null = null;
    branchName: string | null = null;
    CreatedById: number | null;
    StartDate: Date | null = null;
    Code: string | null = null;
    CreateName: string | null = null;
    EndDate: Date | null = null;
    TrackingNumber: string | null;
}
