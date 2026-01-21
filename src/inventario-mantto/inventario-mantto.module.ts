import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { InventarioManttoController } from './inventario-mantto.controller';
import { InventarioManttoService } from './inventario-mantto.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [InventarioManttoController],
  providers: [InventarioManttoService],
  exports: [InventarioManttoService],
})
export class InventarioManttoModule {}
