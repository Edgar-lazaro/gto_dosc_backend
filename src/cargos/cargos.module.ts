import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CargosController } from './cargos.controller';
import { CargosService } from './cargos.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CargosController],
  providers: [CargosService],
})
export class CargosModule {}
