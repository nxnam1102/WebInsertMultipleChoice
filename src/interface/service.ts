export interface ResponseData<T> {
  MessageCode: number;
  Message: string;
  Content: T;
}
export interface AppConfigData {
  ALERT_TIME: number;
  API_URL: string;
}
