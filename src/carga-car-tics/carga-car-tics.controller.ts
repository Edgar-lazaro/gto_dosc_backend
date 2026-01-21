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
import { CargaCarTicsService } from './carga-car-tics.service';
import { CreateCargaCarTicsDto } from './dto/create-carga-car-tics.dto';
import { UpdateCargaCarTicsDto } from './dto/update-carga-car-tics.dto';

@Controller('carga-car-tics')
@UseGuards(JwtGuard, RolesGuard)
export class CargaCarTicsController {
  constructor(private readonly service: CargaCarTicsService) {}

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
  create(@Body() dto: CreateCargaCarTicsDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateCargaCarTicsDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
