import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../../../shared/modules/prisma/prisma.service';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/categories-input.dto';

const uid = 'fcca0cf5-4e29-41e1-83ec-ce14fa973b11';

const categoryDTO: CreateCategoryDto = {
  name: 'Eletrônicos',
  enable: true,
};

describe('CategoriesService', () => {
  let service: CategoriesService;

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
        new InternalServerErrorException('Mocked error'),
      );

      await expect(service.create(categoryDTO)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw BadRequestException if category already exists', async () => {
      prismaServiceMock.categories.findFirst.mockResolvedValueOnce(categoryDTO);

      await expect(service.create(categoryDTO)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const mockCategories = [
        {
          uid: 'fcca0cf5-4e29-41e1-83ec-ce14fa973b11',
          name: 'Eletrônicos',
          enable: true,
        },
        {
          uid: '4f8f05a2-c694-4e7f-b972-4bad692e0ca5',
          name: 'Moda',
          enable: true,
        },
      ];
      prismaServiceMock.categories.findMany.mockResolvedValueOnce(
        mockCategories,
      );

      const result = await service.findAll();

      expect(result).toEqual(mockCategories);
    });

    it('should throw InternalServerErrorException on error', async () => {
      prismaServiceMock.categories.findMany.mockRejectedValueOnce(
        new Error('Mocked error'),
      );

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce({
        uid,
        name: 'Eletrônicos',
        enable: false,
      });

      prismaServiceMock.categories.update.mockResolvedValueOnce({
        uid,
        ...categoryDTO,
      });

      const result = await service.update(uid, categoryDTO);

      expect(result).toEqual({ uid, ...categoryDTO });
    });

    it('should throw NotFoundException if category is not found', async () => {
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce(null);

      await expect(service.update(uid, categoryDTO)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce({
        uid,
        name: 'Eletrônicos',
        enable: false,
      });

      prismaServiceMock.categories.update.mockRejectedValueOnce(
        new Error('Mocked error'),
      );

      await expect(service.update(uid, categoryDTO)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('disable', () => {
    it('should disable a category', async () => {
      const existingCategory = { uid, name: 'Eletrônicos', enable: true };

      prismaServiceMock.categories.findUnique.mockResolvedValueOnce(
        existingCategory,
      );

      const updatedCategory = { ...existingCategory, enable: false };

      prismaServiceMock.categories.update.mockResolvedValueOnce(
        updatedCategory,
      );

      const result = await service.disable(uid, { enable: false });

      expect(result).toEqual(updatedCategory);
    });

    it('should throw NotFoundException if category is not found', async () => {
      prismaServiceMock.categories.findUnique.mockResolvedValueOnce(null);

      await expect(service.disable(uid, { enable: false })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      const existingCategory = { uid, name: 'Eletrônicos', enable: true };

      prismaServiceMock.categories.findUnique.mockResolvedValueOnce(
        existingCategory,
      );

      prismaServiceMock.categories.update.mockRejectedValueOnce(
        new Error('Mocked error'),
      );

      await expect(service.disable(uid, { enable: false })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
