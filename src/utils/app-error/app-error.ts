import { HttpStatus } from '@nestjs/common';

export class AppError extends Error {
  constructor(public statusCode: HttpStatus, public message = '') {
    super(message);
  }

  static badRequest(message = 'Bad request') {
    return new AppError(HttpStatus.BAD_REQUEST, message);
  }

  static notFound(message = 'Not found') {
    return new AppError(HttpStatus.NOT_FOUND, message);
  }

  static unauthorized() {
    return new AppError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
  }
}
