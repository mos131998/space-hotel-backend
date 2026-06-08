import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/database/generated/prisma/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const userRole = request.user?.role;

    if (userRole && requiredRoles.includes(userRole)) return true;

    throw new ForbiddenException({
      message: 'You do not have permission to access this resource',
      code: 'FORBIDDEN'
    });
  }
}
