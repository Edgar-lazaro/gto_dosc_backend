import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TareaAsignacionesController } from './tarea-asignaciones.controller';
import { TareaAsignacionesService } from './tarea-asignaciones.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TareaAsignacionesController],
  providers: [TareaAsignacionesService],
})
export class TareaAsignacionesModule {}
