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
import { Cargos } from '../auth/decorators/cargos.decorator';
import { CargosGuard } from '../auth/guards/cargos.guard';
import { CombustibleService } from './combustible.service';
import { CreateCombustibleDto } from './dto/create-combustible.dto';
import { UpdateCombustibleDto } from './dto/update-combustible.dto';

@Controller('combustible')
@UseGuards(JwtGuard)
export class CombustibleController {
  constructor(private readonly service: CombustibleService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCombustibleDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCombustibleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(CargosGuard)
  @Cargos(1, 2)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
