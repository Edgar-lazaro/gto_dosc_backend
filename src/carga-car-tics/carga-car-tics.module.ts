import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CargaCarTicsController } from './carga-car-tics.controller';
import { CargaCarTicsService } from './carga-car-tics.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CargaCarTicsController],
  providers: [CargaCarTicsService],
})
export class CargaCarTicsModule {}
