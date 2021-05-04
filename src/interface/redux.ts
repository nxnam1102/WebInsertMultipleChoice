export interface ActionPayload<T> {
  type: string;
  payload?: T;
}

export interface ReduxStateBase {
  isLoading?: boolean;
  updateStatus?: string;
  updateMessage?: string;
}
