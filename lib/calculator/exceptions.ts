export type APIErrorCode =
  | "ITL3_NOT_FOUND"
  | "INSUFFICIENT_PRICES_PAID_DATA"
  | "UNHANDLED_EXCEPTION";

interface APIErrorParams {
  code: APIErrorCode;
  message: string;
  status?: number;
}

export class APIError extends Error {
  public code: APIErrorCode;
  public status: number;

  constructor({ code, message, status = 500 }: APIErrorParams) {
    super(message);
    this.name = "APIError";
    this.code = code;
    this.status = status;
  }
}
