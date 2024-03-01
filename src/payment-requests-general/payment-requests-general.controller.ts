import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaymentRequestsGeneralService } from './payment-requests-general.service';

@Controller()
export class PaymentRequestsGeneralController {
  constructor(
    private readonly paymentRequestsGeneralService: PaymentRequestsGeneralService,
  ) {}

  @Post('payment-request-general')
  @UseInterceptors(FilesInterceptor('file'))
  create(
    @Body()
    paymentRequestGeneral: any,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return this.paymentRequestsGeneralService.create(
      paymentRequestGeneral,
      files,
    );
  }
}
