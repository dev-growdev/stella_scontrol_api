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
import { PaymentRequestsGeneralService } from './payment-requests-general.service';
import { CreatePaymentRequestGeneralDto } from './dto/payment-requests-general-input.dto';

@Controller('payment-request-general')
export class PaymentRequestsGeneralController {
  constructor(
    private readonly paymentRequestsGeneralService: PaymentRequestsGeneralService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  create(
    @Body()
    paymentRequestGeneral: CreatePaymentRequestGeneralDto,
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

  @Get('/:userUid')
  listPaymentsRequestsByUser(@Param('userUid') userUid: string) {
    return this.paymentRequestsGeneralService.listByUser(userUid);
  }
}
