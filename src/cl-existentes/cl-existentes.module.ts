import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ClExistentesController } from './cl-existentes.controller';
import { ClExistentesService } from './cl-existentes.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ClExistentesController],
  providers: [ClExistentesService],
})
export class ClExistentesModule {}
