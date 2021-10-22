import { HttpStatus } from '@nestjs/common';

export interface AppResponseModel<T = any> {
  status: HttpStatus;
  message: string;
  successfull: boolean;
  data: T;
}
