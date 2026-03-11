import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { SuccessResponse } from '../types/response.type';
import { Request } from 'express';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<SuccessResponse<unknown>> {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.url;
    return next.handle().pipe(
      map((data: unknown) => ({
        success: true,
        data,
        path,
        timeStamp: new Date().toISOString()
      }))
    );
  }
}
