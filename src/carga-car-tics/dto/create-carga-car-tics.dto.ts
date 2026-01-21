import { IsBase64, IsOptional, IsString } from 'class-validator';

export class CreateCargaCarTicsDto {
  @IsString()
  operador!: string;

  @IsString()
  km_bf_carga!: string;

  @IsBase64()
  foto_km_bf!: string;

  @IsString()
  km_af_carga!: string;

  @IsBase64()
  foto_km_af!: string;

  @IsString()
  vehiculo!: string;

  @IsBase64()
  foto_ticket!: string;
}
