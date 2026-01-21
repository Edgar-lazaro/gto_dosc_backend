import { PartialType } from '@nestjs/mapped-types';
import { CreateClExistenteDto } from './create-cl-existente.dto';

export class UpdateClExistenteDto extends PartialType(CreateClExistenteDto) {}
