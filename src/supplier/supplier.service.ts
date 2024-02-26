import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ReceitawsRepository } from '../integrations/receitaws.repository';
import { SiegerRepository } from '../integrations/sieger.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupplierService {
  constructor(
    private prisma: PrismaService,
    private siegerRepository: SiegerRepository,
    private receitawsRepository: ReceitawsRepository,
  ) {}

  async findSupplierByCPForCNPJ(cpfOrCnpj: string) {
    try {
      const supplierSieger =
        await this.siegerRepository.findSupplierByCPForCNPJ(cpfOrCnpj);

      if (!supplierSieger) {
        const existingSupplier = await this.prisma.tempSuppliersData.findUnique(
          {
            where: { cnpj: cpfOrCnpj },
            select: {
              uid: true,
              name: true,
              cnpj: true,
              source: true,
            },
          },
        );

        if (!existingSupplier) {
          const supplierReceita =
            await this.receitawsRepository.findSupplierByCNPJ(cpfOrCnpj);

          if (supplierReceita) {
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

            return createdSupplier;
          }
        }

        return existingSupplier;
      }

      return supplierSieger;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
