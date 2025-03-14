export class Brand {
  id!: number;
  name!: string;
  description!: string;
  status!: boolean;
  isDeleted!: boolean;
  version!: number;
  
  constructor() {
    this.status = false;  // Initialize with false
  }
}

