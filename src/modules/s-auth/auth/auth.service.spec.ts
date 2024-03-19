import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { InternalServerErrorException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDTO } from './dtos/auth-input.dto';
import { PrismaService } from '@/shared/modules/prisma/prisma.service';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn(),
};

const authDto: AuthDTO = {
  name: 'Error User',
  email: 'erroruser@example.com',
  idUserAd: 'errorUserIdAd',
};

const createdUser = {
  uid: 'mockUserId',
  name: 'Growdev - S.Control',
  email: 'growdev_scontrol@stella.com.br',
  idUserAd: 'algumiduserad',
};

const userId = 'validUserId';

const existingUser = {
  uid: 'mockUserId',
  name: 'Existing User',
  email: 'existinguser@example.com',
  idUserAd: 'existingUserIdAd',
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Signin', () => {
    const createSpy = jest.spyOn(mockPrismaService.user, 'create');
    const findUniqueSpy = jest.spyOn(mockPrismaService.user, 'findUnique');
    const signAsyncSpy = jest.spyOn(mockJwtService, 'signAsync');

    afterEach(() => {
      createSpy.mockClear();
      findUniqueSpy.mockClear();
      signAsyncSpy.mockClear();
    });

    it('should create a new user and return user data with access_token', async () => {
      findUniqueSpy.mockResolvedValue(null);
      createSpy.mockResolvedValue(createdUser);
      signAsyncSpy.mockResolvedValue('mockAccessToken');

      const result = await service.signin(authDto);

      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { email: authDto.email },
      });
      expect(createSpy).toHaveBeenCalledWith({ data: { ...authDto } });
      expect(signAsyncSpy).toHaveBeenCalledWith({
        uid: createdUser.uid,
        name: createdUser.name,
        email: createdUser.email,
        idUserAd: createdUser.idUserAd,
      });
      expect(result).toEqual({
        user: createdUser,
        access_token: 'mockAccessToken',
      });
    });

    it('should return user data with access_token for an existing user', async () => {
      findUniqueSpy.mockResolvedValue(existingUser);
      signAsyncSpy.mockResolvedValue('mockAccessToken');

      const result = await service.signin(authDto);

      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { email: authDto.email },
      });
      expect(signAsyncSpy).toHaveBeenCalledWith({
        uid: existingUser.uid,
        name: existingUser.name,
        email: existingUser.email,
        idUserAd: existingUser.idUserAd,
      });
      expect(result).toEqual({
        user: existingUser,
        access_token: 'mockAccessToken',
      });
    });

    it('should handle errors when creating a user', async () => {
      findUniqueSpy.mockResolvedValue(null);
      createSpy.mockImplementation(() => {
        throw new Error('Some error');
      });

      await expect(service.signin(authDto)).rejects.toThrowError(
        new InternalServerErrorException('Some error'),
      );
    });

    it('should handle errors when signing the token', async () => {
      findUniqueSpy.mockResolvedValue(null);
      createSpy.mockResolvedValue(createdUser);
      signAsyncSpy.mockImplementation(() => {
        throw new Error('Token error');
      });

      await expect(service.signin(authDto)).rejects.toThrowError(
        new InternalServerErrorException('Token error'),
      );
    });
  });
});
