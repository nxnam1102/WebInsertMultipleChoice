export interface DataLogging {
  time?: string | null | undefined;
  userId: number;
  name?: string | undefined | null;
  stack?: string | undefined | null;
  trace?: any | undefined | null;
  message?: string | undefined | null;
  type: TypeLogging;
}
export type TypeLogging = "ERROR" | "SUCCESS" | "INFO" | "WARNING";
