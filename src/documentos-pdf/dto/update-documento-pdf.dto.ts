import { PartialType } from '@nestjs/swagger';
import { CreateDocumentoPdfDto } from './create-documento-pdf.dto';

export class UpdateDocumentoPdfDto extends PartialType(CreateDocumentoPdfDto) {}
