import { IsOptional, IsString } from 'class-validator';

export class CreateGerenciaDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  tabla_inventario?: string;

  @IsOptional()
  @IsString()
  carga_gas?: string;

  @IsOptional()
  @IsString()
  uso_car?: string;
}
