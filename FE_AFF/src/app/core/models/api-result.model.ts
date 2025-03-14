export interface ApiResult<T> {
    Message: string;
    Status: boolean;
    Data: T;
}
