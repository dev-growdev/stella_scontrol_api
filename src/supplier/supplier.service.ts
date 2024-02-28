import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ReceitawsRepository } from '../integrations/receitaws.repository';
import { SiegerRepository } from '../integrations/sieger.repository';
import { PrismaService } from '../prisma/prisma.service';
import { SupplierDto } from './dto/suppplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    private prisma: PrismaService,
    private siegerRepository: SiegerRepository,
    private receitawsRepository: ReceitawsRepository,
  ) {}

  async findSupplierByCPForCNPJ(
    cpfOrCnpj: string,
  ): Promise<SupplierDto | undefined> {
    try {
      const supplierSiger = await this.siegerRepository.findSupplierByCPForCNPJ(
        cpfOrCnpj,
      );

      if (supplierSiger) {
        return {
          cpfOrCpnj: supplierSiger.cpfCnpj,
          name: supplierSiger.name,
          source: 'siger',
        };
      }

      const existingSupplier = await this.prisma.tempSuppliersData.findUnique({
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

      const supplierReceita = await this.receitawsRepository.findSupplierByCNPJ(
        cpfOrCnpj,
      );

      if (!supplierReceita) return undefined;

      const formatCnpj = cpfOrCnpj.replace(/\D/g, '');

      const createdSupplier = await this.prisma.tempSuppliersData.create({
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
