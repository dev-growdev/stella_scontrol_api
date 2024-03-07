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
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { PaymentRequestGeneralDTO } from './dto';
import { PaymentRequestsGeneralService } from './payment-requests-general.service';

@Controller()
export class PaymentRequestsGeneralController {
  constructor(
    private readonly paymentRequestsGeneralService: PaymentRequestsGeneralService,
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
}
