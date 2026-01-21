import { IsNumberString, IsObject, IsString, IsUUID } from 'class-validator';

export class CreateCombustibleDto {
  
  @IsString()
  hora_ini!: string;

  @IsString()
  hora_final!: string;

 
  @IsUUID()
  nombre!: string;

 
  @IsNumberString()
  km_inicio!: string;

  @IsNumberString()
  lvl_km_ini!: string;

  @IsString()
  destino!: string;

  @IsNumberString()
  km_final!: string;

  @IsNumberString()
  lvl_km_fin!: string;

  @IsObject()
  foto_ini!: Record<string, any>;

  @IsObject()
  foto_fin!: Record<string, any>;
}
