import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from './supplier.service';
import { InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../shared/modules/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { truncatePrisma } from 'test/setup/truncate-database';
import { FacadesModule } from '@/modules/@facades/facades.module';

describe('SupplierService -', () => {
  let sut: SupplierService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FacadesModule],
      providers: [SupplierService, PrismaService, ConfigService],
    }).compile();

    sut = module.get<SupplierService>(SupplierService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await truncatePrisma();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('FindSupplierByCPForCNPJ -', () => {
    it('should find supplier by CNPJ in siger', async () => {
      const cnpj = '1234567891011';
      const supplierSigerMock = {
        name: 'EMPRESA LTDA',
        cpfCnpj: '1234567891011',
      };

      jest
        .spyOn(sut['siegerFacade'], 'findSupplierByCPForCNPJ')
        .mockResolvedValue(supplierSigerMock);

      const supplier = await sut.findSupplierByCPForCNPJ(cnpj);

      expect(supplier).toEqual({
        cpfOrCpnj: '1234567891011',
        name: 'EMPRESA LTDA',
        source: 'siger',
      });
    });

    it('should find supplier by CNPJ in database', async () => {
      const cnpj = '1234567891011';

      const supplierDB = await prisma.tempSuppliersData.create({
        data: {
          cnpj,
          name: 'EMPRESA LTDA',
          source: 'receita',
        },
      });

      jest
        .spyOn(sut['siegerFacade'], 'findSupplierByCPForCNPJ')
        .mockResolvedValue(undefined);

      const supplier = await sut.findSupplierByCPForCNPJ(cnpj);

      expect(supplier).toEqual({
        uid: supplierDB.uid,
        cpfOrCpnj: '1234567891011',
        name: 'EMPRESA LTDA',
        source: 'receita',
      });

      await prisma.tempSuppliersData.delete({ where: { uid: supplierDB.uid } });
    });

    it('should return undefined if not found in siger, database and receita', async () => {
      const cnpj = '1234567891011';

      jest
        .spyOn(sut['siegerFacade'], 'findSupplierByCPForCNPJ')
        .mockResolvedValue(undefined);

      jest
        .spyOn(sut['receitawsFacade'], 'findSupplierByCNPJ')
        .mockResolvedValue(undefined);

      const supplier = await sut.findSupplierByCPForCNPJ(cnpj);

      expect(supplier).toBeUndefined();
    });

    it('should return supplier from receita if not found in siger and database', async () => {
      const cnpj = '1234567891011';
      const supplierMock = {
        cnpj,
        name: 'EMPRESA LTDA',
      };

      jest
        .spyOn(sut['siegerFacade'], 'findSupplierByCPForCNPJ')
        .mockResolvedValue(undefined);

      jest
        .spyOn(sut['receitawsFacade'], 'findSupplierByCNPJ')
        .mockResolvedValue(supplierMock);

      const supplier = await sut.findSupplierByCPForCNPJ(cnpj);

      const supplierDB = await prisma.tempSuppliersData.findFirst({
        where: { cnpj },
      });

      expect(supplierDB).toBeTruthy();

      expect(supplierDB.name).toBe('EMPRESA LTDA');
      expect(supplierDB.cnpj).toBe('1234567891011');
      expect(supplierDB.source).toBe('receita');

      expect(supplier).toEqual({
        uid: supplierDB.uid,
        cpfOrCpnj: '1234567891011',
        name: 'EMPRESA LTDA',
        source: 'receita',
      });

      await prisma.tempSuppliersData.delete({ where: { uid: supplierDB.uid } });
    });

    it('should throw error when call siger', async () => {
      const cpfOrCnpj = '00000000000000';

      jest
        .spyOn(sut['siegerFacade'], 'findSupplierByCPForCNPJ')
        .mockRejectedValue(new InternalServerErrorException('Error message'));

      await expect(sut.findSupplierByCPForCNPJ(cpfOrCnpj)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw error when call receita', async () => {
      const cpfOrCnpj = '00000000000000';

      jest
        .spyOn(sut['siegerFacade'], 'findSupplierByCPForCNPJ')
        .mockResolvedValue(undefined);

      jest
        .spyOn(sut['receitawsFacade'], 'findSupplierByCNPJ')
        .mockRejectedValue(new InternalServerErrorException('Error message'));

      await expect(sut.findSupplierByCPForCNPJ(cpfOrCnpj)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
