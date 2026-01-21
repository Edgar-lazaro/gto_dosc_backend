import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JefaturasController } from './jefaturas.controller';
import { JefaturasService } from './jefaturas.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [JefaturasController],
  providers: [JefaturasService],
})
export class JefaturasModule {}
