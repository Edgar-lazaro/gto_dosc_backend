import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { DocumentosPdfController } from './documentos-pdf.controller';
import { DocumentosPdfService } from './documentos-pdf.service';
import { GlpiModule } from '../glpi/glpi.module';

@Module({
  imports: [PrismaModule, AuthModule, GlpiModule],
  controllers: [DocumentosPdfController],
  providers: [DocumentosPdfService],
})
export class DocumentosPdfModule {}
