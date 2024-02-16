import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesDTO } from './dto';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

const makeCategoriesDTO = (): CategoriesDTO => {
  return {
    name: 'Eletrônicos',
    enable: true,
  };
};

const uid = 'fcca0cf5-4e29-41e1-83ec-ce14fa973b11';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create - POST', () => {
    it('should create a category and return the created data on success', async () => {
      const categoryDTO = makeCategoriesDTO();

      jest.spyOn(service, 'create').mockImplementation(async () => {
        return Promise.resolve({
          uid: 'fcca0cf5-4e29-41e1-83ec-ce14fa973b11',
          name: 'Eletrônicos',
          enable: true,
        });
      });

      const result = await controller.create(categoryDTO);

      expect(result).toBeDefined();
      expect(result.uid).toEqual('fcca0cf5-4e29-41e1-83ec-ce14fa973b11');
    });

    it('should handle duplicate category and return BadRequestException on failure', async () => {
      const categoryDTO = makeCategoriesDTO();

      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new BadRequestException('Essa categoria já existe.');
      });

      try {
        await controller.create(categoryDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Essa categoria já existe.');
      }
    });

    it('should handle errors and return InternalServerErrorException on failure', async () => {
      const categoryDTO = makeCategoriesDTO();

      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new InternalServerErrorException('Test error');
      });

      try {
        await controller.create(categoryDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('FindAll - GET', () => {
    it('should get all categories on success', async () => {
      const categoriesData = [
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

      jest.spyOn(service, 'findAll').mockImplementation(async () => {
        return Promise.resolve(categoriesData);
      });

      const result = await controller.findAll();

      expect(result).toBeDefined();
      expect(result).toEqual(categoriesData);
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
    it('should update a category and return the updated data on success', async () => {
      const categoryDTO = makeCategoriesDTO();

      jest.spyOn(service, 'update').mockImplementation(async () => {
        return Promise.resolve({
          uid: 'fcca0cf5-4e29-41e1-83ec-ce14fa973b11',
          name: 'Eletrônicos',
          enable: true,
        });
      });

      const result = await controller.update(
        'fcca0cf5-4e29-41e1-83ec-ce14fa973b11',
        categoryDTO,
      );

      expect(result).toBeDefined();
      expect(result.uid).toEqual('fcca0cf5-4e29-41e1-83ec-ce14fa973b11');
      expect(result.name).toEqual('Eletrônicos');
    });

    it('should handle not found category and return NotFoundException on failure', async () => {
      const categoryDTO = makeCategoriesDTO();

      jest.spyOn(service, 'update').mockImplementation(async () => {
        throw new NotFoundException('Categoria não encontrada.');
      });

      try {
        await controller.update('nonexistent-uid', categoryDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Categoria não encontrada.');
      }
    });

    it('should handle errors and return InternalServerErrorException on failure', async () => {
      const categoryDTO = makeCategoriesDTO();

      jest.spyOn(service, 'update').mockImplementation(async () => {
        throw new InternalServerErrorException('Test error');
      });

      try {
        await controller.update(
          'fcca0cf5-4e29-41e1-83ec-ce14fa973b11',
          categoryDTO,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('Disable - PUT', () => {
    it('should disable a category and return the updated data on success', async () => {
      const categoryDTO = { name: 'Eletrônicos', enable: false };

      jest.spyOn(service, 'disable').mockImplementation(async () => {
        return Promise.resolve({
          uid: 'fcca0cf5-4e29-41e1-83ec-ce14fa973b11',
          name: 'Eletrônicos',
          enable: false,
        });
      });

      const result = await controller.dissable(
        'fcca0cf5-4e29-41e1-83ec-ce14fa973b11',
        categoryDTO,
      );

      expect(result).toBeDefined();
      expect(result.uid).toEqual('fcca0cf5-4e29-41e1-83ec-ce14fa973b11');
      expect(result.enable).toEqual(false);
    });

    it('should handle not found category and return NotFoundException on failure', async () => {
      const categoryDTO = { name: 'Eletrônicos', enable: false };

      jest.spyOn(service, 'disable').mockImplementation(async () => {
        throw new NotFoundException('Categoria não encontrada.');
      });

      try {
        await controller.dissable('nonexistent-uid', categoryDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Categoria não encontrada.');
      }
    });

    it('should handle errors and return InternalServerErrorException on failure', async () => {
      const categoryDTO = { name: 'Eletrônicos', enable: false };

      jest.spyOn(service, 'disable').mockImplementation(async () => {
        throw new InternalServerErrorException('Test error');
      });

      try {
        await controller.dissable(
          'fcca0cf5-4e29-41e1-83ec-ce14fa973b11',
          categoryDTO,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Test error');
      }
    });
  });
});
