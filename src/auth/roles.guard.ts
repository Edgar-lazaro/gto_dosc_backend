import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [ctx.getHandler(), ctx.getClass()],
      );

    if (!requiredRoles) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user || !user.roles) {
      throw new ForbiddenException();
    }

    const allowed = requiredRoles.some(r =>
      user.roles.includes(r),
    );

    if (!allowed) throw new ForbiddenException();

    return true;
  }
}