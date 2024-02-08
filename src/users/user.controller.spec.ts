import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

const mockIdUserAd = 'mockUserIdAd';
const mockDeletedUser = {
  uid: 'mockUserId',
  name: 'Mock User',
  email: 'mockuser@example.com',
  idUserAd: 'mockUserIdAd',
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

  describe('Remove - DELETE', () => {
    it('should call userService.remove with the provided id_user_ad and return the deleted user', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(mockDeletedUser);

      const result = await controller.remove(mockIdUserAd);

      expect(service.remove).toHaveBeenCalledWith(mockIdUserAd);
      expect(result).toEqual(mockDeletedUser);
    });

    it('should handle BadRequestException when id_user_ad is not provided', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new BadRequestException('ID do usuário não fornecido');
      });

      try {
        await controller.remove('');
      } catch (error) {
        expect(error.message).toBe('ID do usuário não fornecido');
      }
    });

    it('should handle NotFoundException when the user with the provided id_user_ad is not found', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new NotFoundException('Usuário não encontrado!');
      });

      try {
        await controller.remove(mockIdUserAd);
      } catch (error) {
        expect(error.message).toBe('Usuário não encontrado!');
      }
    });

    it('should handle InternalServerErrorException for other unexpected errors', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new InternalServerErrorException('Some error');
      });

      try {
        await controller.remove(mockIdUserAd);
      } catch (error) {
        expect(error.message).toBe('Some error');
      }
    });
  });
});
