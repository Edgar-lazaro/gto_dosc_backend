import { PartialType } from '@nestjs/mapped-types';
import { CreateTareaAvanceDto } from './create-tarea-avance.dto';

export class UpdateTareaAvanceDto extends PartialType(CreateTareaAvanceDto) {}
