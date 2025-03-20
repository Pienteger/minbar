import { inherits } from "util";
import { IBaseResponse } from "./IBaseResponse";

export interface QueryRecordResponse<TEntity> extends IBaseResponse {
  isSuccess: boolean;
  errorMessage?: string;
  additionalData?: Record<string, any>;
  data?: TEntity;
}
