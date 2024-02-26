import { Test, TestingModule } from '@nestjs/testing';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { ReceitawsRepository } from '../integrations/receitaws.repository';
import { SiegerRepository } from '../integrations/sieger.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { knexConfig } from '../integrations/knexconfig';

describe('SupplierController', () => {
  let controller: SupplierController;
  let service: SupplierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [
        SupplierService,
        ReceitawsRepository,
        SiegerRepository,
        PrismaService,
        ConfigService,
      ],
      imports: [
        KnexModule.forRoot({
          config: knexConfig,
        }),
      ],
    }).compile();

    controller = module.get<SupplierController>(SupplierController);
    service = module.get<SupplierService>(SupplierService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find supplier by CPF or CNPJ successfully from SiegerRepository', async () => {
    const cpfOrCnpj = '1234567891011';
    const expectedResult = {
      cpfCnpj: '1234567891011',
      name: 'EMPRESA LTDA',
    };

    jest
      .spyOn(service['siegerRepository'], 'findSupplierByCPForCNPJ')
      .mockResolvedValue(expectedResult);

    const result = await controller.findSupplierByCPForCNPJ(cpfOrCnpj);

    expect(result).toBe(expectedResult);
  });

  it('should find supplier by CPF or CNPJ successfully from ReceitawsRepository', async () => {
    const cpfOrCnpj = '1234567891011';
    const expectedResult = {
      uid: '1bba2a6b-dbd1-442c-aae3-8f080f441d7d',
      name: 'EMPRESA LTDA',
      cnpj: '1234567891011',
      source: 'receita',
    };

    jest
      .spyOn(service['receitawsRepository'], 'findSupplierByCNPJ')
      .mockResolvedValue(expectedResult);

    const result = await controller.findSupplierByCPForCNPJ(cpfOrCnpj);
    expect(result).toStrictEqual(expectedResult);
  });

  it('should handle errors when finding supplier by CPF or CNPJ', async () => {
    const cpfOrCnpj = 'invalid-value';

    jest
      .spyOn(service['siegerRepository'], 'findSupplierByCPForCNPJ')
      .mockRejectedValue(new InternalServerErrorException('Error message'));
    jest
      .spyOn(service['receitawsRepository'], 'findSupplierByCNPJ')
      .mockRejectedValue(new InternalServerErrorException('Error message'));

    await expect(controller.findSupplierByCPForCNPJ(cpfOrCnpj)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
