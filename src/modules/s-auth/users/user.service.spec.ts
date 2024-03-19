import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

const mockPrismaService = {
  user: {
    update: jest.fn(),
  },
};

const mockIdUserAd = 'mockUserIdAd';

const mockDisableUser = {
  uid: 'mockUserId',
  name: 'Mock User',
  email: 'mockuser@example.com',
  idUserAd: 'mockUserIdAd',
  enable: false
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Disable - PUT', () => {
    const updateSpy = jest.spyOn(mockPrismaService.user, 'update');

    afterEach(() => {
      updateSpy.mockClear();
    });
  
    it('should disable a user by id_user_ad', async () => {
      updateSpy.mockResolvedValue(mockDisableUser);
  
      const result = await controller.disable(mockIdUserAd);
  
      expect(updateSpy).toHaveBeenCalledWith({
        where: { idUserAd: mockIdUserAd },
        data: { enable: false },
      });
      expect(result).toEqual(mockDisableUser);
    });
  
    it('should handle BadRequestException when id_user_ad is not provided', async () => {
      updateSpy.mockRejectedValue(new BadRequestException('ID do usuário não fornecido'));
  
      await expect(controller.disable(mockIdUserAd)).rejects.toThrowError(
        new BadRequestException('ID do usuário não fornecido')
      );
    });
  
    it('should handle NotFoundException when user is not found', async () => {
      updateSpy.mockResolvedValue(null);
  
      await expect(controller.disable(mockIdUserAd)).rejects.toThrowError(
        new NotFoundException('Usuário não encontrado!')
      );
    });
  
    it('should handle InternalServerErrorException on unexpected errors', async () => {
      updateSpy.mockRejectedValue(new InternalServerErrorException('Some unexpected error'));
  
      await expect(controller.disable(mockIdUserAd)).rejects.toThrowError(
        new InternalServerErrorException('Some unexpected error')
      );
    });
  });
});
