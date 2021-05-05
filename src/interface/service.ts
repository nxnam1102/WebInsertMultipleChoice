export interface ResponseData<T> {
  MessageCode: number;
  Message: string;
  Content: T;
}
