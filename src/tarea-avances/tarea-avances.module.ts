import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TareaAvancesController } from './tarea-avances.controller';
import { TareaAvancesService } from './tarea-avances.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TareaAvancesController],
  providers: [TareaAvancesService],
})
export class TareaAvancesModule {}
