import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any) {
    const oneKb = 10000;
    return value.size < oneKb;
  }
}
