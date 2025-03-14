export class OptionsFilterOrderHistory {
    PageSize: number = 30;
    PageIndex: number = 1;
    OrderTrackingNumber?: string;
    UserId?: number;
    OrderStatus?: number;
    PaymentType?: number;
    constructor(
        PageSize: number = 30,
        PageIndex: number = 1,
        OrderTrackingNumber?: string,
        UserId?: number,
        OrderStatus?: number,
        PaymentType?: number
    ) {
        this.PageSize = PageSize? PageSize : 30;
        this.PageIndex = PageIndex;
        this.OrderTrackingNumber = OrderTrackingNumber ? OrderTrackingNumber : undefined;
        this.UserId = UserId ? UserId : undefined;
        this.OrderStatus = OrderStatus ? OrderStatus : undefined;
        this.PaymentType = PaymentType ? PaymentType : undefined;
    }
}
