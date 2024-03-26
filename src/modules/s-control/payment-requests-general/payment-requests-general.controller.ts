import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as mime from 'mime';
import {
  CreatePaymentRequestGeneralDto,
  UpdatePaymentRequestGeneralDto,
} from './dto/payment-requests-general-input.dto';
import { PaymentRequestsGeneralService } from './payment-requests-general.service';

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

  @Get('file/:filePath')
  listOneFile(@Param('filePath') filePath, @Res() res) {
    const file = fs.readFileSync(process.env.ROOT_PATH_FILE + '/' + filePath);

    const base64FileConvert = file.toString('base64');

    const extension = filePath.split('.').pop();

    const mimeType = mime.lookup(extension) || 'application/octet-stream';

    const base64File = `data:${mimeType};base64,${base64FileConvert}`;

    const data = {
      base64: base64File,
      type: mimeType,
    };
    return res.send(data);
  }

  @Get('/:userUid')
  listPaymentsRequestsByUser(@Param('userUid') userUid: string) {
    return this.paymentRequestsGeneralService.listByUser(userUid);
  }

  @Put('/:userUid/:requestUid')
  @UseInterceptors(FilesInterceptor('file'))
  updatePaymentsRequestsByUser(
    @Param('userUid') userUid: string,
    @Param('requestUid') requestUid: string,
    @Body()
    updateData: UpdatePaymentRequestGeneralDto,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    const form = JSON.parse(updateData.document);
    return this.paymentRequestsGeneralService.updatePaymentsRequestsByUser(
      userUid,
      requestUid,
      form,
      files,
    );
  }
}
