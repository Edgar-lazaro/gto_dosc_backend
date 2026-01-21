import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateTareaAdjuntoDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  tareaId: string;

  @IsOptional()
  @IsString()
  usuarioId?: string;

  @IsIn(['foto', 'documento'])
  tipo: 'foto' | 'documento';

  @IsString()
  nombre: string;
}
