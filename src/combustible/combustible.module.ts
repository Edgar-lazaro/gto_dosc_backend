import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CombustibleController } from './combustible.controller';
import { CombustibleService } from './combustible.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CombustibleController],
  providers: [CombustibleService],
})
export class CombustibleModule {}
