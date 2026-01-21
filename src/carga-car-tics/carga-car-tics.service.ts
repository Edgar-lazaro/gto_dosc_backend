import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { parseBigIntId, serializeBigInt } from '../common/serialize-bigint';
import { CreateCargaCarTicsDto } from './dto/create-carga-car-tics.dto';
import { UpdateCargaCarTicsDto } from './dto/update-carga-car-tics.dto';

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  const buf = Buffer.from(value, 'base64');
  const ab = new ArrayBuffer(buf.byteLength);
  new Uint8Array(ab).set(buf);
  return new Uint8Array(ab);
}

@Injectable()
export class CargaCarTicsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const rows = await this.prisma.carga_car_tics.findMany({ orderBy: { id: 'desc' } });
    return serializeBigInt(rows);
  }

  async findOne(idRaw: string) {
    let id: bigint;
    try {
      id = parseBigIntId(idRaw);
    } catch {
      throw new BadRequestException('Invalid id');
    }

    const row = await this.prisma.carga_car_tics.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Not found');
    return serializeBigInt(row);
  }

  async create(dto: CreateCargaCarTicsDto) {
    const created = await this.prisma.carga_car_tics.create({
      data: {
        operador: dto.operador,
        km_bf_carga: dto.km_bf_carga,
        foto_km_bf: base64ToBytes(dto.foto_km_bf),
        km_af_carga: dto.km_af_carga,
        foto_km_af: base64ToBytes(dto.foto_km_af),
        vehiculo: dto.vehiculo,
        foto_ticket: base64ToBytes(dto.foto_ticket),
      },
    });

    return serializeBigInt(created);
  }

  async update(idRaw: string, dto: UpdateCargaCarTicsDto) {
    let id: bigint;
    try {
      id = parseBigIntId(idRaw);
    } catch {
      throw new BadRequestException('Invalid id');
    }

    const data: any = {
      operador: dto.operador,
      km_bf_carga: dto.km_bf_carga,
      foto_km_bf: dto.foto_km_bf ? base64ToBytes(dto.foto_km_bf) : undefined,
      km_af_carga: dto.km_af_carga,
      foto_km_af: dto.foto_km_af ? base64ToBytes(dto.foto_km_af) : undefined,
      vehiculo: dto.vehiculo,
      foto_ticket: dto.foto_ticket ? base64ToBytes(dto.foto_ticket) : undefined,
    };

    try {
      const updated = await this.prisma.carga_car_tics.update({ where: { id }, data });
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
      const deleted = await this.prisma.carga_car_tics.delete({ where: { id } });
      return serializeBigInt(deleted);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Not found');
      }
      throw err;
    }
  }
}
