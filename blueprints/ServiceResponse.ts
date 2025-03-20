export interface ServiceResponse<T = void> {
  isSuccess?: boolean;
  errorMessage?: string;
  data?: T;
}
