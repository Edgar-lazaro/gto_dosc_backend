import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCoreSyncQueueDto {
  @IsString()
  entidad!: string;

  @IsString()
  entidadId!: string;

  @IsString()
  accion!: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  procesado?: boolean;
}
