import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CARGOS_KEY } from '../decorators/cargos.decorator';

@Injectable()
export class CargosGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredCargoIds = this.reflector.getAllAndOverride<number[]>(
      CARGOS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredCargoIds) return true;

    const { user } = context.switchToHttp().getRequest();
    const rawCargoId = user?.cargoId;
    if (rawCargoId === null || rawCargoId === undefined) return false;

    const cargoId = Number(rawCargoId);
    if (!Number.isInteger(cargoId)) return false;

    return requiredCargoIds.includes(cargoId);
  }
}
