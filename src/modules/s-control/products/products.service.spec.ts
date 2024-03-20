import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/products-input.dto';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/shared/modules/prisma/prisma.service';

const uid = '2a4cdbad-aab0-470a-ae48-e4693d62ce9e';

const productDto: CreateProductDto = {
  name: 'Caneta Esferográfica',
  enable: true,
  categoryId: '4e292f89-ef81-41f4-8be8-da44c0012f8b',
  measurement: 'unidades',
  quantity: 100,
};

describe('ProductsService', () => {
  let service: ProductsService;

  const prismaServiceMock = {
    products: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    categories: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      prismaServiceMock.products.findFirst.mockResolvedValueOnce(null);
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce({
        uid: '2a4cdbad-aab0-470a-ae48-e4693d62ce9e',
      });

      prismaServiceMock.products.create.mockResolvedValueOnce(productDto);

      const result = await service.create(productDto);

      expect(result).toEqual(productDto);
    });

    it('should throw BadRequestException if product already exists', async () => {
      prismaServiceMock.products.findFirst.mockResolvedValueOnce(productDto);

      await expect(service.create(productDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if category is not found', async () => {
      prismaServiceMock.products.findFirst.mockResolvedValueOnce(null);

      prismaServiceMock.categories.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(productDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        {
          uid: '2a4cdbad-aab0-470a-ae48-e4693d62ce9e',
          categoryId: '4e292f89-ef81-41f4-8be8-da44c0012f8b',
          code: 12345,
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
      prismaServiceMock.products.findMany.mockResolvedValueOnce(mockProducts);

      const result = await service.findAll();

      expect(result).toEqual(mockProducts);
    });

    it('should throw InternalServerErrorException if category is not found', async () => {
      prismaServiceMock.products.findUnique.mockResolvedValueOnce({
        uid,
        ...productDto,
      });
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce(null);

      await expect(service.update(uid, productDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      prismaServiceMock.products.findUnique.mockResolvedValueOnce({
        uid,
        ...productDto,
      });
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce({
        uid: '2a4cdbad-aab0-470a-ae48-e4693d62ce9e',
      });

      prismaServiceMock.products.update.mockResolvedValueOnce({
        uid,
        ...productDto,
      });

      const result = await service.update(uid, productDto);

      expect(result).toEqual({ uid, ...productDto });
    });

    it('should throw NotFoundException if product is not found', async () => {
      prismaServiceMock.products.findUnique.mockResolvedValueOnce(null);

      await expect(service.update(uid, productDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException if category is not found', async () => {
      prismaServiceMock.products.findUnique.mockResolvedValueOnce({
        uid,
        ...productDto,
      });
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce(null);

      await expect(service.update(uid, productDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      prismaServiceMock.products.findUnique.mockResolvedValueOnce({
        uid,
        ...productDto,
      });
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce({
        uid: '2a4cdbad-aab0-470a-ae48-e4693d62ce9e',
      });

      prismaServiceMock.products.update.mockRejectedValueOnce(
        new Error('Mocked error'),
      );

      await expect(service.update(uid, productDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('disable', () => {
    it('should disable a product', async () => {
      prismaServiceMock.products.findUnique.mockResolvedValueOnce({
        uid,
        ...productDto,
      });

      prismaServiceMock.products.update.mockResolvedValueOnce({
        uid,
        ...productDto,
        enable: false,
      });

      const result = await service.disable(uid, false);

      expect(result).toEqual({ uid, ...productDto, enable: false });
    });

    it('should throw NotFoundException if product is not found', async () => {
      prismaServiceMock.products.findUnique.mockResolvedValueOnce(null);

      await expect(service.disable(uid, false)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      prismaServiceMock.products.findUnique.mockResolvedValueOnce({
        uid,
        ...productDto,
      });

      prismaServiceMock.products.update.mockRejectedValueOnce(
        new Error('Mocked error'),
      );

      await expect(service.disable(uid, false)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
