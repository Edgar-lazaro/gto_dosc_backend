import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CoreSyncQueueController } from './core-sync-queue.controller';
import { CoreSyncQueueService } from './core-sync-queue.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CoreSyncQueueController],
  providers: [CoreSyncQueueService],
})
export class CoreSyncQueueModule {}
