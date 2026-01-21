import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { parseBigIntId, serializeBigInt } from '../common/serialize-bigint';
import { CreateUsoCarTicsDto } from './dto/create-uso-car-tics.dto';
import { UpdateUsoCarTicsDto } from './dto/update-uso-car-tics.dto';

function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  const buf = Buffer.from(value, 'base64');
  const ab = new ArrayBuffer(buf.byteLength);
  new Uint8Array(ab).set(buf);
  return new Uint8Array(ab);
}

@Injectable()
export class UsoCarTicsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const rows = await this.prisma.uso_car_tics.findMany({ orderBy: { id: 'desc' } });
    return serializeBigInt(rows);
  }

  async findOne(idRaw: string) {
    let id: bigint;
    try {
      id = parseBigIntId(idRaw);
    } catch {
      throw new BadRequestException('Invalid id');
    }

    const row = await this.prisma.uso_car_tics.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Not found');
    return serializeBigInt(row);
  }

  async create(dto: CreateUsoCarTicsDto) {
    const created = await this.prisma.uso_car_tics.create({
      data: {
        vehiculo: dto.vehiculo,
        conductor: dto.conductor,
        destino: dto.destino,
        hora_inicio: dto.hora_inicio,
        nivel_combustible: dto.nivel_combustible,
        kilometraje_inicial: dto.kilometraje_inicial,
        foto_km_inicial: dto.foto_km_inicial ? base64ToBytes(dto.foto_km_inicial) : undefined,
        hora_final: dto.hora_final,
        kilometraje_final: dto.kilometraje_final,
        foto_km_final: dto.foto_km_final ? base64ToBytes(dto.foto_km_final) : undefined,
      },
    });

    return serializeBigInt(created);
  }

  async update(idRaw: string, dto: UpdateUsoCarTicsDto) {
    let id: bigint;
    try {
      id = parseBigIntId(idRaw);
    } catch {
      throw new BadRequestException('Invalid id');
    }

    const data: any = {
      vehiculo: dto.vehiculo,
      conductor: dto.conductor,
      destino: dto.destino,
      hora_inicio: dto.hora_inicio,
      nivel_combustible: dto.nivel_combustible,
      kilometraje_inicial: dto.kilometraje_inicial,
      foto_km_inicial: dto.foto_km_inicial ? base64ToBytes(dto.foto_km_inicial) : undefined,
      hora_final: dto.hora_final,
      kilometraje_final: dto.kilometraje_final,
      foto_km_final: dto.foto_km_final ? base64ToBytes(dto.foto_km_final) : undefined,
    };

    try {
      const updated = await this.prisma.uso_car_tics.update({ where: { id }, data });
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
      const deleted = await this.prisma.uso_car_tics.delete({ where: { id } });
      return serializeBigInt(deleted);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException('Not found');
      }
      throw err;
    }
  }
}
