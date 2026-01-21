import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { InventarioTicsController } from './inventario-tics.controller';
import { InventarioTicsService } from './inventario-tics.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [InventarioTicsController],
  providers: [InventarioTicsService],
})
export class InventarioTicsModule {}
