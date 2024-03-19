import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDTO } from './dtos';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const mockUser = {
  uid: 'mockUserId',
  name: 'Mock User',
  email: 'mockuser@example.com',
  idUserAd: 'mockUserIdAd',
};

const expectedResult = {
  user: {
    uuid: mockUser.uid,
    idUserAd: mockUser.idUserAd,
    data: {
      displayName: mockUser.name,
      email: mockUser.email,
      photoURL: '',
      shortcuts: [],
    },
    role: ['admin'],
  },
};

const loginDto: AuthDTO = {
  name: 'Growdev - S.Control',
  email: 'growdev_scontrol@stella.com.br',
  idUserAd: 'algumiduserad',
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, PrismaService, JwtService, ConfigService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Signin - POST', () => {
    it('should call authService.getUserByUid with the user from JwtAuthGuard and return user data', async () => {
      jest.spyOn(service, 'getUserByUid').mockResolvedValue(expectedResult);

      const result = await controller.token(mockUser);

      expect(service.getUserByUid).toHaveBeenCalledWith(mockUser.uid);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors when calling authService.signin', async () => {
      jest.spyOn(service, 'signin').mockImplementation(() => {
        throw new Error('Some error');
      });

      try {
        await controller.signin(loginDto);
      } catch (error) {
        console.error('Actual error:', error.message);
        expect(error.message).toBe('Some error');
      }
    });
  });

  describe('Token - GET', () => {
    it('should call authService.getUserByUid with the user from JwtAuthGuard and return user data', async () => {
      jest.spyOn(service, 'getUserByUid').mockResolvedValue(expectedResult);

      const result = await controller.token(mockUser);

      expect(service.getUserByUid).toHaveBeenCalledWith(mockUser.uid);

      expect(result).toEqual(expectedResult);
    });

    it('should handle errors when calling authService.getUserByUid', async () => {
      jest.spyOn(service, 'getUserByUid').mockImplementation(() => {
        throw new Error('Some error');
      });

      try {
        await controller.token(mockUser);
      } catch (error) {
        expect(error.message).toBe('Some error');
      }
    });
  });
});
