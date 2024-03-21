import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/products-input.dto';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/shared/modules/prisma/prisma.service';
import { ProductDto } from './dto/products-output.dto';

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

      const mockCreate: ProductDto = {
        name: productDto.name,
        enable: productDto.enable,
        uid: '2a4cdbad-aab0-470a-ae48-e4693d62ce9e',
        code: 12345,
      };
      prismaServiceMock.products.create.mockResolvedValueOnce(mockCreate);

      const result = await service.create(productDto);

      expect(result).toEqual({
        name: productDto.name,
        enable: productDto.enable,
        uid: '2a4cdbad-aab0-470a-ae48-e4693d62ce9e',
        code: 12345,
        description: undefined,
      });
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
          description: 'Caneta esferográfica azul, ponta fina.',
          enable: true,
          measurement: 'unidades',
          quantity: 10,
        },
        {
          uid: '7728fa6d-6036-4ea4-b9e5-74a3223ce844',
          categoryId: '5c8f9d1b-0f88-4f31-a95a-865e9fcdff23',
          code: 56789,
          name: 'Calça Jeans Masculina',
          description: 'Calça jeans masculina, tamanho 42.',
          enable: true,
          measurement: 'peças',
          quantity: 20,
        },
      ];
      prismaServiceMock.products.findMany.mockResolvedValueOnce(mockProducts);

      const result = await service.findAll();

      expect(result).toEqual(
        mockProducts.map(({ categoryId: _, ...rest }) => rest),
      );
    });

    it('should throw InternalServerErrorException if category is not found', async () => {
      prismaServiceMock.products.findMany.mockResolvedValueOnce([
        { uid, ...productDto },
      ]);
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce(null);

      await expect(service.update(uid, productDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      prismaServiceMock.products.findMany.mockResolvedValueOnce([
        { uid, ...productDto, code: 12345 },
      ]);
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce({
        uid: '2a4cdbad-aab0-470a-ae48-e4693d62ce9e',
      });

      prismaServiceMock.products.update.mockResolvedValueOnce({
        uid,
        ...productDto,
        code: 12345,
      });

      const result = await service.update(uid, productDto);

      expect(result).toEqual({
        uid,
        name: productDto.name,
        enable: productDto.enable,
        measurement: productDto.measurement,
        quantity: productDto.quantity,
        code: 12345,
        description: undefined,
      });
    });

    it('should throw NotFoundException if product is not found', async () => {
      prismaServiceMock.products.findMany.mockResolvedValueOnce([]);

      await expect(service.update(uid, productDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if category is not found', async () => {
      prismaServiceMock.products.findMany.mockResolvedValueOnce([
        { uid, ...productDto },
      ]);
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce(null);

      await expect(service.update(uid, productDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      prismaServiceMock.products.findMany.mockResolvedValueOnce([
        { uid, ...productDto },
      ]);
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce({
        uid: '2a4cdbad-aab0-470a-ae48-e4693d62ce9e',
      });

      prismaServiceMock.products.update.mockRejectedValueOnce(
        new InternalServerErrorException('Mocked error'),
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
      const stubResponse: ProductDto = {
        uid,
        code: 12345,
        name: productDto.name,
        enable: false,
      };

      prismaServiceMock.products.update.mockResolvedValueOnce(stubResponse);

      const result = await service.disable(uid, false);

      expect(result).toEqual({
        ...stubResponse,
        description: undefined,
      });
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
        new InternalServerErrorException('Mocked error'),
      );

      await expect(service.disable(uid, false)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
