export interface ResponseData<T> {
    msgCode: number;
    message: string;
    content: T;
}