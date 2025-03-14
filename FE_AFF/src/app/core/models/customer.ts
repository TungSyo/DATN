export class Customer{
    id?: number;
    code?: string;
    name?: string;
    phoneNumber?: string;
    email?: string;
    dayOfBirth?: Date;
    gender?: string;
    linkAvarta?: string;
    storeId?: number;
    storeName?: string;
    customerGroupId?: number;
    customerGroupName?: string;
    customerRankId?: number;
    customerRankName?: string;
    wardId?: number;
    cityName?: string;
    districtName?: string;
    wardName?: string;
    addressDetail?: string;
    referenceId?: number;
    referenceCode?: string;
    isDeleted?: number;
    version?: number;
    base64_image!:string;
  }
  
  export class OptionsFilterCustomer{
      pageSize: number | null = 10;
      pageIndex: number | null = 1;
      nameOrPhoneNumber : string | null = '';
      // sortOrder: string | null = "desc";
      // KeyWord: string  | null = null;
      // CategoryId: number | null = null;
      // StartPrice: number | null = null;
      // EndPrice: number | null = null;
      // Status: number | null = null;
  }
  
  
  