import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { parseBigIntId, serializeBigInt } from '../common/serialize-bigint';
import { CreateCombustibleDto } from './dto/create-combustible.dto';
import { UpdateCombustibleDto } from './dto/update-combustible.dto';

@Injectable()
export class CombustibleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const rows = await this.prisma.combustible.findMany({ orderBy: { id: 'desc' } });
    return serializeBigInt(rows);
  }

  async findOne(idRaw: string) {
    let id: bigint;
    try {
      id = parseBigIntId(idRaw);
    } catch {
      throw new BadRequestException('Invalid id');
    }

    const row = await this.prisma.combustible.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Not found');
    return serializeBigInt(row);
  }

  async create(dto: CreateCombustibleDto) {
    const usuario = await this.prisma.user.findUnique({ where: { id: dto.nombre }, select: { id: true } });
    if (!usuario) throw new BadRequestException(`nombre (User.id) no existe: ${dto.nombre}`);

    const created = await this.prisma.combustible.create({
      data: {
        hora_ini: dto.hora_ini as any,
        hora_final: dto.hora_final as any,
        km_inicio: new Prisma.Decimal(dto.km_inicio),
        lvl_km_ini: new Prisma.Decimal(dto.lvl_km_ini),
        destino: dto.destino,
        km_final: new Prisma.Decimal(dto.km_final),
        lvl_km_fin: new Prisma.Decimal(dto.lvl_km_fin),
        foto_ini: dto.foto_ini as any,
        foto_fin: dto.foto_fin as any,
        User: { connect: { id: dto.nombre } },
      } as any,
    });

    return serializeBigInt(created);
  }

  async update(idRaw: string, dto: UpdateCombustibleDto) {
    let id: bigint;
    try {
      id = parseBigIntId(idRaw);
    } catch {
      throw new BadRequestException('Invalid id');
    }

    let connectUsuario: any = undefined;
    if (dto.nombre !== undefined) {
      const usuario = await this.prisma.user.findUnique({ where: { id: dto.nombre }, select: { id: true } });
      if (!usuario) throw new BadRequestException(`nombre (User.id) no existe: ${dto.nombre}`);
      connectUsuario = { connect: { id: dto.nombre } };
    }

    const data: any = {
      hora_ini: dto.hora_ini !== undefined ? (dto.hora_ini as any) : undefined,
      hora_final: dto.hora_final !== undefined ? (dto.hora_final as any) : undefined,
      km_inicio: dto.km_inicio !== undefined ? new Prisma.Decimal(dto.km_inicio) : undefined,
      lvl_km_ini: dto.lvl_km_ini !== undefined ? new Prisma.Decimal(dto.lvl_km_ini) : undefined,
      destino: dto.destino,
      km_final: dto.km_final !== undefined ? new Prisma.Decimal(dto.km_final) : undefined,
      lvl_km_fin: dto.lvl_km_fin !== undefined ? new Prisma.Decimal(dto.lvl_km_fin) : undefined,
      foto_ini: dto.foto_ini !== undefined ? (dto.foto_ini as any) : undefined,
      foto_fin: dto.foto_fin !== undefined ? (dto.foto_fin as any) : undefined,
      User: connectUsuario,
    };

    try {
      const updated = await this.prisma.combustible.update({ where: { id }, data });
      return serializeBigInt(updated);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Not found');
      }
      throw err;
    }
  }

  async remove(idRaw: string) {
    let id: bigint;
    try {
      id = parseBigIntId(idRaw);
    } catch {
      throw new BadRequestException('Invalid id');
    }

    try {
      const deleted = await this.prisma.combustible.delete({ where: { id } });
      return serializeBigInt(deleted);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Not found');
      }
      throw err;
    }
  }
}
