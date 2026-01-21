import { PartialType } from '@nestjs/swagger';
import { CreateGerenciaDto } from './create-gerencia.dto';

export class UpdateGerenciaDto extends PartialType(CreateGerenciaDto) {}
