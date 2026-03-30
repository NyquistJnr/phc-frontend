export interface TokenErrorMessage {
  token_class: string;
  token_type: string;
  message: string;
}

export interface BackendErrorResponse {
  status: string;
  message: string;
  data: any;
  errors?: {
    detail?: string;
    code?: string;
    messages?: TokenErrorMessage[];
    [key: string]: any;
  } | any;
}

export class ApiError extends Error {
  public status: string;
  public data: any;
  public errors: any;

  constructor(public response: BackendErrorResponse, public statusCode: number) {
    const errorMessage = response.errors?.detail 
      || response.message 
      || "An unexpected error occurred while communicating with the API.";

    super(errorMessage);
    this.name = "ApiError";
    this.status = response.status || "error";
    this.data = response.data;
    this.errors = response.errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get isTokenInvalid(): boolean {
    return this.errors?.code === "token_not_valid" || this.statusCode === 401;
  }
}
