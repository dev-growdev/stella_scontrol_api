import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/shared/modules/prisma/prisma.service';

const mockIdUserAd = 'mockUserIdAd';
const mockDisableUser = {
  uid: 'mockUserId',
  name: 'Mock User',
  email: 'mockuser@example.com',
  idUserAd: 'mockUserIdAd',
  enable: false,
  createdAt: new Date('2024-02-27T10:30:00Z'),
  updatedAt: new Date('2024-02-27T10:30:00Z'),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Disable - PUT', () => {
    it('should call userService.disableUser with the provided id_user_ad and return the disable user', async () => {
      jest.spyOn(service, 'disableUser').mockResolvedValue(mockDisableUser);

      const result = await controller.disable({ id_user_ad: mockIdUserAd });

      expect(service.disableUser).toHaveBeenCalledWith(mockIdUserAd);
      expect(result).toEqual(mockDisableUser);
    });

    it('should handle BadRequestException when id_user_ad is not provided', async () => {
      jest.spyOn(service, 'disableUser').mockImplementation(() => {
        throw new BadRequestException('ID do usuário não fornecido');
      });

      try {
        await controller.disable({ id_user_ad: '' });
      } catch (error) {
        expect(error.message).toBe('ID do usuário não fornecido');
      }
    });

    it('should handle NotFoundException when the user with the provided id_user_ad is not found', async () => {
      jest.spyOn(service, 'disableUser').mockImplementation(() => {
        throw new NotFoundException('Usuário não encontrado!');
      });

      try {
        await controller.disable({ id_user_ad: mockIdUserAd });
      } catch (error) {
        expect(error.message).toBe('Usuário não encontrado!');
      }
    });

    it('should handle InternalServerErrorException for other unexpected errors', async () => {
      jest.spyOn(service, 'disableUser').mockImplementation(() => {
        throw new InternalServerErrorException('Some error');
      });

      try {
        await controller.disable({ id_user_ad: mockIdUserAd });
      } catch (error) {
        expect(error.message).toBe('Some error');
      }
    });
  });
});
