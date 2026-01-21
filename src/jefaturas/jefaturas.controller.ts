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
import { JefaturasService } from './jefaturas.service';
import { CreateJefaturaDto } from './dto/create-jefatura.dto';
import { UpdateJefaturaDto } from './dto/update-jefatura.dto';

@Controller('jefaturas')
@UseGuards(JwtGuard, RolesGuard)
export class JefaturasController {
  constructor(private readonly service: JefaturasService) {}

  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.service.findOne(id, req.user);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateJefaturaDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateJefaturaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
