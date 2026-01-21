import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateDocumentoPdfDto {
  @IsString()
  nombre_archivo: string;

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
  url_storage: string;

  @IsString()
  usuario_nombre: string;

  @IsInt()
  @Min(0)
  gerencia_id: number;

  @IsInt()
  @Min(0)
  jefatura_id: number;

  @IsString()
  checklist_nombre: string;

  @IsOptional()
  @Matches(/^[0-9]+$/)
  tamano_bytes?: string;
}
