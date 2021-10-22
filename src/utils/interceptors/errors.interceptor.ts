import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { catchError, Observable, throwError } from 'rxjs';

import { AppError } from '../app-error';
import { AppResponse } from '../app-response';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof AppError) {
          return throwError(() => AppResponse.fromAppError(err));
        }
        console.error(err);

        return throwError(() => AppResponse.internal());
      }),
    );
  }
}
