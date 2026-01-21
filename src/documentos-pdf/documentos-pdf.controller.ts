import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DocumentosPdfService } from './documentos-pdf.service';
import { CreateDocumentoPdfDto } from './dto/create-documento-pdf.dto';
import { UpdateDocumentoPdfDto } from './dto/update-documento-pdf.dto';

@Controller('documentos-pdf')
@UseGuards(JwtGuard, RolesGuard)
export class DocumentosPdfController {
  constructor(private readonly service: DocumentosPdfService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Req() req: any, @Body() dto: CreateDocumentoPdfDto) {
    const userId = req.user?.sub ?? req.user?.id;
    return this.service.create(userId, dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateDocumentoPdfDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
