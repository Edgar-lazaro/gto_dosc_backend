import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClExistentesService } from './cl-existentes.service';
import { CreateClExistenteDto } from './dto/create-cl-existente.dto';
import { UpdateClExistenteDto } from './dto/update-cl-existente.dto';

@Controller('cl-existentes')
@UseGuards(JwtGuard, RolesGuard)
export class ClExistentesController {
  constructor(private readonly service: ClExistentesService) {}

  @Get()
  findAll(@Query('jefatura') jefatura?: string) {
    return this.service.findAll({ jefatura });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateClExistenteDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateClExistenteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
