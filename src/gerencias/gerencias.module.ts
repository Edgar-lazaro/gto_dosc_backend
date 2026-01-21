import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { GerenciasController } from './gerencias.controller';
import { GerenciasService } from './gerencias.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [GerenciasController],
  providers: [GerenciasService],
})
export class GerenciasModule {}
