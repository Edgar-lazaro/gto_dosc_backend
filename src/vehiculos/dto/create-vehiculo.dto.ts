import { IsString } from 'class-validator';

export class CreateVehiculoDto {
  @IsString()
  marca!: string;

  @IsString()
  modelo!: string;

  @IsString()
  placas!: string;

  @IsString()
  gerencia!: string;

  @IsString()
  nombre_clave!: string;
}
