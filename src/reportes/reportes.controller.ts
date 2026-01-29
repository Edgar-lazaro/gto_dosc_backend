import {
  Controller,
  Post,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import type { Request } from 'express';

import { JwtGuard } from '../auth/guards/jwt.guard';
import {
  buildPublicFileUrl,
  resolveAdjuntoRelativeDir,
  resolveUploadsRoot,
} from '../uploads/uploads.util';

@Controller('reportes')
@UseGuards(JwtGuard)
export class ReportesController {
  @Post('adjuntos')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, file, cb) => {
          const uploadsRoot = resolveUploadsRoot();
          const relative = resolveAdjuntoRelativeDir('reportes', {
            originalname: file?.originalname,
            mimetype: file?.mimetype,
          });
          const dest = path.join(uploadsRoot, relative);
          try {
            fs.mkdirSync(dest, { recursive: true });
          } catch (err) {
            cb(err as Error, dest);
            return;
          }
          cb(null, dest);
        },
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname || '');
          const name = `${crypto.randomUUID()}${ext}`;
          cb(null, name);
        },
      }),
    }),
  )
  async adjuntar(
    @Req() req: Request,
    @UploadedFile()
    file?: {
      filename: string;
      originalname?: string;
      mimetype?: string;
    },
  ) {
    if (!file) {
      return { url: null };
    }

    const relative = resolveAdjuntoRelativeDir('reportes', {
      originalname: file.originalname,
      mimetype: file.mimetype,
    });

    const url = buildPublicFileUrl(req, relative, file.filename);

    return {
      url,
      filename: file.filename,
      originalname: file.originalname ?? null,
      mimetype: file.mimetype ?? null,
    };
  }
}
