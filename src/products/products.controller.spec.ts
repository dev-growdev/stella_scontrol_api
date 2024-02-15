import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProductDTO } from './dto';
import { ConfigService } from '@nestjs/config';

const makeProductsDTO = (): ProductDTO => {
  return {
    name: 'Caneta Esferográfica',
    enable: true,
    categoryId: '4e292f89-ef81-41f4-8be8-da44c0012f8b',
    code: 'P12345',
    measurement: 'unidades',
    quantity: 100,
  };
};

const uid = '2a4cdbad-aab0-470a-ae48-e4693d62ce9e'

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create - POST', () => {
    it('should create a product and return the created data on success', async () => {
      const productDTO = makeProductsDTO();

      jest.spyOn(service, 'create').mockImplementation(async () => {
        return Promise.resolve({
          uid: '2a4cdbad-aab0-470a-ae48-e4693d62ce9e',
          categoryId: '4e292f89-ef81-41f4-8be8-da44c0012f8b',
          code: 'P12345',
          name: 'Caneta Esferográfica',
          enable: true,
          measurement: 'unidades',
          quantity: 100,
        });
      });

      const result = await controller.create(productDTO);

      expect(result).toBeDefined();
      expect(result.uid).toEqual('2a4cdbad-aab0-470a-ae48-e4693d62ce9e');
    });

    it('should handle duplicate product and return BadRequestException on failure', async () => {
      const productDTO = makeProductsDTO();

      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new BadRequestException('Esse produto já existe.');
      });

      try {
        await controller.create(productDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Esse produto já existe.');
      }
    });

    it('should handle category not found and return BadRequestException on failure', async () => {
      const productDTO = makeProductsDTO();

      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new BadRequestException('Categoria não encontrada.');
      });

      try {
        await controller.create(productDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Categoria não encontrada.');
      }
    });

    it('should handle errors and return InternalServerErrorException on failure', async () => {
      const productDTO = makeProductsDTO();

      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new InternalServerErrorException('Test error');
      });

      try {
        await controller.create(productDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('FindAll - GET', () => {
    it('should get all products on success', async () => {
      const productsData = [
        {
          uid: '2a4cdbad-aab0-470a-ae48-e4693d62ce9e',
          categoryId: '4e292f89-ef81-41f4-8be8-da44c0012f8b',
          code: 'P12345',
          name: 'Caneta Esferográfica',
          enable: true,
          measurement: 'unidades',
          quantity: 10,
        },
        {
          uid: '7728fa6d-6036-4ea4-b9e5-74a3223ce844',
          categoryId: '5c8f9d1b-0f88-4f31-a95a-865e9fcdff23',
          code: 'C56789',
          name: 'Calça Jeans Masculina',
          enable: true,
          measurement: 'peças',
          quantity: 20,
        },
      ];

      jest.spyOn(service, 'findAll').mockImplementation(async () => {
        return Promise.resolve(productsData);
      });

      const result = await controller.findAll();

      expect(result).toBeDefined();
      expect(result).toEqual(productsData);
    });

    it('should handle errors and return InternalServerErrorException on failure', async () => {
      jest.spyOn(service, 'findAll').mockImplementation(async () => {
        throw new InternalServerErrorException('Test error');
      });

      try {
        await controller.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('Update - PUT', () => {
    it('should update a product and return the updated data on success', async () => {
      const productDTO = makeProductsDTO();

      jest.spyOn(service, 'update').mockImplementation(async () => {
        return Promise.resolve({
          uid: '2a4cdbad-aab0-470a-ae48-e4693d62ce9e',
          categoryId: '4e292f89-ef81-41f4-8be8-da44c0012f8b',
          code: 'P12345',
          name: 'Caneta Esferográfica',
          enable: true,
          measurement: 'unidades',
          quantity: 10,
        });
      });

      const result = await controller.update(uid, productDTO);

      expect(result).toBeDefined();
      expect(result.uid).toEqual('2a4cdbad-aab0-470a-ae48-e4693d62ce9e');
      expect(result.name).toEqual('Caneta Esferográfica');
    });

    it('should handle not found product and return NotFoundException on failure', async () => {
      const productDTO = makeProductsDTO();

      jest.spyOn(service, 'update').mockImplementation(async () => {
        throw new NotFoundException('Produto não encontrado.');
      });

      try {
        await controller.update(uid, productDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Produto não encontrado.');
      }
    });

    it('should handle category not found and return BadRequestException on failure', async () => {
      const productDTO = makeProductsDTO();

      jest.spyOn(service, 'update').mockImplementation(async () => {
        throw new BadRequestException('Categoria não encontrada.');
      });

      try {
        await controller.update(uid, productDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Categoria não encontrada.');
      }
    });

    it('should handle errors and return InternalServerErrorException on failure', async () => {
      const productDTO = makeProductsDTO();

      jest.spyOn(service, 'update').mockImplementation(async () => {
        throw new InternalServerErrorException('Test error');
      });

      try {
        await controller.update(uid, productDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Test error');
      }
    });
  });
});
