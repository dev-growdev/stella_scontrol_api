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
import { truncatePrisma } from 'test/setup/truncate-database';

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

  afterAll(async () => {
    await truncatePrisma();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('FindSupplierByCPForCNPJ - POST', () => {});
});
