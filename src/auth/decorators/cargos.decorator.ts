import { SetMetadata } from '@nestjs/common';

export const CARGOS_KEY = 'cargos';

export const Cargos = (...cargoIds: Array<number>) =>
  SetMetadata(CARGOS_KEY, cargoIds);
