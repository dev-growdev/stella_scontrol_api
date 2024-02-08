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
    delete: jest.fn(),
  },
};

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('remove', () => {
    const deleteSpy = jest.spyOn(mockPrismaService.user, 'delete');

    afterEach(() => {
      deleteSpy.mockClear();
    });

    it('should remove a user by id_user_ad', async () => {
      const idUserAd = 'someUserIdAd';
      const deletedUser = { /* Mock your deleted user data here */ };

      deleteSpy.mockResolvedValue(deletedUser);

      const result = await controller.remove(idUserAd);

      expect(deleteSpy).toHaveBeenCalledWith({ where: { idUserAd } });
      expect(result).toEqual(deletedUser);
    });

    it('should handle BadRequestException when id_user_ad is not provided', async () => {
      const idUserAd = ''; // Empty id_user_ad

      await expect(controller.remove(idUserAd)).rejects.toThrowError(
        new BadRequestException('ID do usuário não fornecido'),
      );
    });

    it('should handle NotFoundException when user is not found', async () => {
      const idUserAd = 'nonExistentUserIdAd';

      deleteSpy.mockResolvedValue(null);

      await expect(controller.remove(idUserAd)).rejects.toThrowError(
        new NotFoundException('Usuário não encontrado!'),
      );
    });

    it('should handle InternalServerErrorException on unexpected errors', async () => {
      const idUserAd = 'someUserIdAd';

      deleteSpy.mockImplementation(() => {
        throw new Error('Some unexpected error');
      });

      await expect(controller.remove(idUserAd)).rejects.toThrowError(
        new InternalServerErrorException('Some unexpected error'),
      );
    });
  });
});
