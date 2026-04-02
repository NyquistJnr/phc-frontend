export interface TokenErrorMessage {
  token_class: string;
  token_type: string;
  message: string;
}

export interface BackendErrorResponse {
  status: string;
  message: string;
  data: any;
  errors?:
    | {
        detail?: string;
        code?: string;
        messages?: TokenErrorMessage[];
        [key: string]: any;
      }
    | any;
}

export class ApiError extends Error {
  public status: string;
  public data: any;
  public errors: any;
  public statusCode: number;

  constructor(response: BackendErrorResponse, statusCode: number) {
    const errorMessage =
      response.errors?.detail ||
      response.message ||
      "An unexpected error occurred while communicating with the API.";

    super(errorMessage);
    this.name = "ApiError";
    this.status = response.status || "error";
    this.data = response.data;
    this.errors = response.errors;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get isTokenInvalid(): boolean {
    return (
      this.errors?.code === "token_not_valid" ||
      this.statusCode === 401 ||
      this.message.toLowerCase().includes("token not valid")
    );
  }
}
