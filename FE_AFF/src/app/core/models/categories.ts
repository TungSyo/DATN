export class Category {
    id: number;
    name: string;
    parentId?: number;
    description?: string;
    isDeleted?: number;
    status?: number;
    version?: number;
    constructor() {
        this.status = 1;
    }
}
