export interface User {
    name: string;
    avatarUrl: string;
    groupModuleIds: any;
    id: string;
    firstName: string;
    lastName: string;
}
export interface Product {
    id: number;
    productCategoryId: number;
    productCategoryName: string;
    userId: string;
    userName: string;
    name: string;
    image: string;
    moreImage: string;
    typePrice: number;
    price: number;
    point: number;
    guide: string;
    commitment: string;
    linkDownload: string;
    linkYoutober: string;
    description: string;
    priority: number;
    isPublished: boolean;
    isApproved: boolean;
    createdAt: string;
    rateCount: number;
    ratePoint: number;
}
