import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { map, Observable } from 'rxjs';

import { AppResponse, AppResponseModel } from '../app-response';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, AppResponseModel<T>>
{
  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<AppResponseModel<T>> {
    return next.handle().pipe(
      map((data): AppResponseModel => {
        return AppResponse.ok(data);
      }),
    );
  }
}
