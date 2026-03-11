import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload';
import { Request } from 'express';

export const currentUser = createParamDecorator(
  (data: keyof JwtPayload, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    if (!user)
      throw new Error('Current user cannot be used without authentication ');

    return data ? user[data] : user;
  }
);
