import { IsOptional, IsString } from 'class-validator';

export class CreateCargoDto {
  @IsOptional()
  @IsString()
  nombre_cargo?: string;

  @IsOptional()
  @IsString()
  nivel_cargo?: string;
}
