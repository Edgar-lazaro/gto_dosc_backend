import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsoCarTicsController } from './uso-car-tics.controller';
import { UsoCarTicsService } from './uso-car-tics.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UsoCarTicsController],
  providers: [UsoCarTicsService],
})
export class UsoCarTicsModule {}
