import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from './supplier.service';
import { ReceitawsRepository } from '../integrations/receitaws.repository';
import { SiegerRepository } from '../integrations/sieger.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KnexModule } from 'nestjs-knex';
import { knexConfig } from '../integrations/knexconfig';
import { ConfigService } from '@nestjs/config';
import { truncatePrisma } from 'test/setup/truncate-database';

describe('SupplierService', () => {
  let service: SupplierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        PrismaService,
        SiegerRepository,
        ReceitawsRepository,
        ConfigService,
      ],
      imports: [
        KnexModule.forRoot({
          config: knexConfig,
        }),
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
  });

  afterAll(async () => {
    await truncatePrisma();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('FindSupplierByCPForCNPJ - POST', () => {
    it('should find supplier by CPF or CNPJ successfully from SiegerRepository', async () => {
      const cpfOrCnpj = '1234567891011';
      const expectedResult = {
        cpfCnpj: '1234567891011',
        name: 'EMPRESA LTDA',
      };

      jest
        .spyOn(service['siegerRepository'], 'findSupplierByCPForCNPJ')
        .mockResolvedValue(expectedResult);

      const result = await service.findSupplierByCPForCNPJ(cpfOrCnpj);

      expect(result).toBe(expectedResult);
    });

    it('should find supplier by CPF or CNPJ in the database successfully', async () => {
      const cpfOrCnpj = '1234567891011';
      const expectedResult = {
        uid: '78f8906e-b7be-4929-8e17-5f633cf482ec',
        name: 'EMPRESA LTDA',
        cnpj: '1234567891011',
        source: 'receita',
        createdAt: new Date('2024-02-27T10:30:00Z'),
        updatedAt: new Date('2024-02-27T10:30:00Z'),
      };

      jest
        .spyOn(service['siegerRepository'], 'findSupplierByCPForCNPJ')
        .mockResolvedValue(null);

      jest
        .spyOn(service['prisma'].tempSuppliersData, 'findUnique')
        .mockResolvedValue(expectedResult);

      const result = await service.findSupplierByCPForCNPJ(cpfOrCnpj);

      expect(result).toHaveProperty('name', expectedResult.name);
      expect(result).toHaveProperty('cnpj', expectedResult.cnpj);
      expect(result).toHaveProperty('source', expectedResult.source);

      if ('uid' in result) {
        expect(result.uid).not.toBeNull();
        expect(result.uid).not.toBeUndefined();
      }
    });

    it('should find supplier by CPF or CNPJ successfully from ReceitawsRepository', async () => {
      const cpfOrCnpj = '1234567891011';
      const expectedResult = {
        uid: 'b68a6a3c-635f-4c06-880c-93c2a2f3c83e',
        name: 'EMPRESA LTDA',
        cnpj: '1234567891011',
        source: 'receita',
      };

      jest
        .spyOn(service['receitawsRepository'], 'findSupplierByCNPJ')
        .mockResolvedValue(expectedResult);

      const result = await service.findSupplierByCPForCNPJ(cpfOrCnpj);

      expect(result).toHaveProperty('name', expectedResult.name);
      expect(result).toHaveProperty('cnpj', expectedResult.cnpj);
      expect(result).toHaveProperty('source', expectedResult.source);

      if ('uid' in result) {
        expect(result.uid).not.toBeNull();
        expect(result.uid).not.toBeUndefined();
      }
    });

    it('should handle errors when finding supplier by CPF or CNPJ', async () => {
      const cpfOrCnpj = '00000000000000';

      jest
        .spyOn(service['siegerRepository'], 'findSupplierByCPForCNPJ')
        .mockRejectedValue(new InternalServerErrorException('Error message'));
      jest
        .spyOn(service['receitawsRepository'], 'findSupplierByCNPJ')
        .mockRejectedValue(new InternalServerErrorException('Error message'));

      await expect(service.findSupplierByCPForCNPJ(cpfOrCnpj)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
