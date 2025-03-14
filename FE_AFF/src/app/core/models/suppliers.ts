export class Supplier{
    id!:number;
    name!:string;
    phone!:string;
    email!:string;
    address!:string;
    taxCode!:string;
    description!:string;
    isDeleted!:number;
    version!: number;
    constructor(){
      this.isDeleted = 0;
    }
  }
  
  export class OptionsFilterSupplier{
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
  