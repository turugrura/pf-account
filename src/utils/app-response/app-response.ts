import { HttpException, HttpStatus } from '@nestjs/common';

import { AppError } from '../app-error';

import { AppResponseModel } from './app-response-model';

export class AppResponse {
  static ok(data: any): AppResponseModel {
    return {
      status: HttpStatus.OK,
      message: 'success',
      successfull: true,
      data,
    };
  }

  static fromAppError(appError: AppError): ErrorResponse {
    return ErrorResponse.create({
      status: appError.statusCode,
      message: appError.message,
      data: null,
    });
  }

  // only use in guard
  static unauthorized(): ErrorResponse {
    return AppResponse.fromAppError(AppError.unauthorized());
  }

  static internal(data: any = null): ErrorResponse {
    return ErrorResponse.create({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      data,
    });
  }
}

class ErrorResponse extends HttpException {
  constructor(response: AppResponseModel) {
    super(response, response.status);
  }

  static create({
    message,
    status,
    data,
  }: Omit<AppResponseModel, 'successfull'>) {
    return new ErrorResponse({
      status,
      message,
      data,
      successfull: false,
    });
  }
}
