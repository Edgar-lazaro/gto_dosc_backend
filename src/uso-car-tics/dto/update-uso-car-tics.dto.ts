import { PartialType } from '@nestjs/mapped-types';
import { CreateUsoCarTicsDto } from './create-uso-car-tics.dto';

export class UpdateUsoCarTicsDto extends PartialType(CreateUsoCarTicsDto) {}
