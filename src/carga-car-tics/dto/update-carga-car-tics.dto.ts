import { PartialType } from '@nestjs/mapped-types';
import { CreateCargaCarTicsDto } from './create-carga-car-tics.dto';

export class UpdateCargaCarTicsDto extends PartialType(CreateCargaCarTicsDto) {}
