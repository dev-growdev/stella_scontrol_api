import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as archiver from 'archiver';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { FilesService } from 'src/shared/services/files.service';
import { PaymentRequestGeneralDTO } from './dto';
import { PaymentRequestsGeneralService } from './payment-requests-general.service';

@Controller()
export class PaymentRequestsGeneralController {
  constructor(
    private readonly paymentRequestsGeneralService: PaymentRequestsGeneralService,
    private filesService: FilesService,
  ) {}

  @Post('payment-request-general')
  @UseInterceptors(
    FilesInterceptor('file', 20, {
      storage: diskStorage({
        destination: process.env.ROOT_PATH_FILES,
        filename: (req, file, callback) => {
          const randomName = `${randomUUID()}-${file.originalname}`;
          callback(null, `${randomName}`);
        },
      }),
    }),
  )
  create(
    @Body()
    paymentRequestGeneral: PaymentRequestGeneralDTO,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    const form = JSON.parse(paymentRequestGeneral.document);
    return this.paymentRequestsGeneralService.create(form, files);
  }

  @Get('file/:imgpath')
  listOneFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: process.env.ROOT_PATH_FILES });
  }

  @Get('files/:imgpaths')
  async listFilesByKey(@Param('imgpaths') imgPaths: string, @Res() res) {
    const imgKeys: string[] = imgPaths.split(',');
    const files = await this.filesService.listFilesByKey(imgKeys);

    res.attachment('files.zip');

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        console.warn(err);
      } else {
        throw err;
      }
    });

    archive.on('error', function (err) {
      throw err;
    });

    archive.pipe(res);

    files.forEach((arquivo) => {
      archive.file(`${process.env.ROOT_PATH_FILES}/${arquivo.key}`, {
        name: arquivo.name,
      });
    });

    archive.finalize();
  }
}
