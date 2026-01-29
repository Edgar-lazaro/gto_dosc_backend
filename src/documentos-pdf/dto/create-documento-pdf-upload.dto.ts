import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDocumentoPdfUploadDto {
  @IsString()
  @IsIn([
    'checklist',
    'mantenimiento',
    'sites',
    'reporte',
    'mantenimiento sites',
    'mantenimiento mostradores',
    'mantenimiento telecomm',
    'combustible',
    'vehiculo',
  ])
  tipo_documento: string;

  @IsString()
  usuario_nombre: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  gerencia_id: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  jefatura_id: number;

  @IsString()
  checklist_nombre: string;

  // Optional override if the client wants to persist an expected name.
  @IsOptional()
  @IsString()
  nombre_archivo?: string;

  @IsOptional()
  @Matches(/^[0-9]+$/)
  tamano_bytes?: string;
}
