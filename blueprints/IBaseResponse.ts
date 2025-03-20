export interface IBaseResponse {
    isSuccess: boolean;
    errorMessage?: string;
    additionalData?: Record<string, any>;
}
