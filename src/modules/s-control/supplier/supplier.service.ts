import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../shared/modules/prisma/prisma.service';
import { SupplierDto } from './dto/suppplier.dto';
import { ReceitawsFacade } from '@/modules/@facades/s-integration/receitaws.facade';
import { SiegerFacade } from '@/modules/@facades/s-integration/sieger.facade';

@Injectable()
export class SupplierService {
  constructor(
    private prisma: PrismaService,
    private siegerFacade: SiegerFacade,
    private receitawsFacade: ReceitawsFacade,
  ) {}

  async findSupplierByCPForCNPJ(
    cpfOrCnpj: string,
  ): Promise<SupplierDto | undefined> {
    try {
      const supplierSiger =
        await this.siegerFacade.findSupplierByCPForCNPJ(cpfOrCnpj);

      if (supplierSiger) {
        return {
          cpfOrCpnj: supplierSiger.cpfCnpj,
          name: supplierSiger.name,
          source: 'siger',
        };
      }

      const existingSupplier = await this.prisma.scTempSuppliersData.findUnique({
        where: { cnpj: cpfOrCnpj },
        select: {
          uid: true,
          name: true,
          cnpj: true,
          source: true,
        },
      });

      if (existingSupplier) {
        return {
          cpfOrCpnj: existingSupplier.cnpj,
          name: existingSupplier.name,
          source: existingSupplier.source,
          uid: existingSupplier.uid,
        };
      }

      const supplierReceita =
        await this.receitawsFacade.findSupplierByCNPJ(cpfOrCnpj);

      if (!supplierReceita) return undefined;

      const formatCnpj = cpfOrCnpj.replace(/\D/g, '');

      const createdSupplier = await this.prisma.scTempSuppliersData.create({
        data: {
          name: supplierReceita.name,
          cnpj: formatCnpj,
          source: 'receita',
        },
        select: {
          uid: true,
          name: true,
          cnpj: true,
          source: true,
        },
      });

      return {
        cpfOrCpnj: createdSupplier.cnpj,
        name: createdSupplier.name,
        source: createdSupplier.source,
        uid: createdSupplier.uid,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
