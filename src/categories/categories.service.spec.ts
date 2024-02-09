import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesDTO } from './dto';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

const uid = '1';

const categoryDTO: CategoriesDTO = {
  name: 'Test Category',
  enable: true,
};

describe('CategoriesService', () => {
  let service: CategoriesService;

  // Mock PrismaService
  const prismaServiceMock = {
    categories: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      prismaServiceMock.categories.findFirst.mockResolvedValueOnce(null);

      prismaServiceMock.categories.create.mockResolvedValueOnce(categoryDTO);

      const result = await service.create(categoryDTO);

      expect(result).toEqual(categoryDTO);
    });

    it('should throw InternalServerErrorException on error during category creation', async () => {
      prismaServiceMock.categories.findFirst.mockRejectedValueOnce(
        new InternalServerErrorException('Mocked error')
      );

      await expect(service.create(categoryDTO)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw BadRequestException if category already exists', async () => {
      prismaServiceMock.categories.findFirst.mockResolvedValueOnce(categoryDTO);

      await expect(service.create(categoryDTO)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const mockCategories = [
        { uid: '1', name: 'Category1', enable: true },
        { uid: '2', name: 'Category2', enable: true },
      ];
      prismaServiceMock.categories.findMany.mockResolvedValueOnce(mockCategories);

      const result = await service.findAll();

      expect(result).toEqual(mockCategories);
    });

    it('should throw InternalServerErrorException on error', async () => {
      prismaServiceMock.categories.findMany.mockRejectedValueOnce(new Error('Mocked error'));

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce({ uid, name: 'Old Category', enable: false });

      prismaServiceMock.categories.update.mockResolvedValueOnce({ uid, ...categoryDTO });

      const result = await service.update(uid, categoryDTO);

      expect(result).toEqual({ uid, ...categoryDTO });
    });

    it('should throw NotFoundException if category is not found', async () => {
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce(null);

      await expect(service.update(uid, categoryDTO)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce({ uid, name: 'Old Category', enable: false });

      prismaServiceMock.categories.update.mockRejectedValueOnce(new Error('Mocked error'));

      await expect(service.update(uid, categoryDTO)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
