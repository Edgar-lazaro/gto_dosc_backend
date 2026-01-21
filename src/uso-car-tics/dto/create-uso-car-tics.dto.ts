import { IsBase64, IsOptional, IsString } from 'class-validator';

export class CreateUsoCarTicsDto {
  @IsString()
  vehiculo!: string;

  @IsString()
  conductor!: string;

  @IsString()
  destino!: string;

  @IsString()
  hora_inicio!: string;

  @IsString()
  nivel_combustible!: string;

  @IsString()
  kilometraje_inicial!: string;

  @IsOptional()
  @IsBase64()
  foto_km_inicial?: string;

  @IsString()
  hora_final!: string;

  @IsString()
  kilometraje_final!: string;

  @IsOptional()
  @IsBase64()
  foto_km_final?: string;
}
