import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateJefaturaDto {
  @IsOptional()
  @IsString()
  nombre_jefatura?: string;

  @IsInt()
  @Min(0)
  gerencia: number;

  @IsOptional()
  @IsString()
  img?: string;
}
