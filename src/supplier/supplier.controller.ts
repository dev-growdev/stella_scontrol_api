import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { SiegerRepository } from '../integrations/sieger.repository';
import { SupplierSieger } from 'src/integrations/dto/sieger.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly siegerRepository: SiegerRepository) { }

  @Get(':cnpj')
  async findSupplierByCNPJ(
    @Param('cnpj') cnpj: string,
  ): Promise<SupplierSieger | undefined> {
    try {
      console.log('teste');
      const supplier = await this.siegerRepository.findSupplierByCNPJ(cnpj);

      return supplier;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
