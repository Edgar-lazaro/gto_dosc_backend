import { IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateClExistenteDto {
  @IsString()
  nombre_cl!: string;

  @IsInt()
  gerencia!: number;

  // FK jefaturas.id (BigInt)
  @IsNumberString()
  jefatura!: string;

  // Legacy: text NOT NULL DEFAULT 'FilesEdit_manto'
  @IsOptional()
  @IsString()
  funcion_form?: string;
}
