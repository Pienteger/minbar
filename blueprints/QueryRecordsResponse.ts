import { IBaseResponse } from "./IBaseResponse";

export interface QueryRecordsResponse<TEntity> extends IBaseResponse {
  isSuccess: boolean;
  errorMessage?: string;
  additionalData?: Record<string, any>;
  data: TEntity[];
}
