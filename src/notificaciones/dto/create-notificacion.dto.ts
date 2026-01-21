import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateNotificacionDto {
  @IsString()
  usuario_id!: string;

  @IsString()
  tipo!: string;

  @IsString()
  titulo!: string;

  @IsString()
  mensaje!: string;

  @IsOptional()
  @IsObject()
  datos_adicionales?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  leida?: boolean;
}
