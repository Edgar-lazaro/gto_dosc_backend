import { PartialType } from '@nestjs/swagger';
import { CreateJefaturaDto } from './create-jefatura.dto';

export class UpdateJefaturaDto extends PartialType(CreateJefaturaDto) {}
