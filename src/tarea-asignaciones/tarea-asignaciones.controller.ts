import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TareaAsignacionesService } from './tarea-asignaciones.service';
import { CreateTareaAsignacionDto } from './dto/create-tarea-asignacion.dto';
import { UpdateTareaAsignacionDto } from './dto/update-tarea-asignacion.dto';

@Controller('tarea-asignaciones')
@UseGuards(JwtGuard, RolesGuard)
export class TareaAsignacionesController {
  constructor(private readonly service: TareaAsignacionesService) {}

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
  create(@Body() dto: CreateTareaAsignacionDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateTareaAsignacionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
