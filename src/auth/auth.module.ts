import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CheckIfUserExistsService, BcryptService } from 'src/shared/services';

import { JwtModule } from '@nestjs/jwt';
import { JwStrategy } from './strategy';
import { JwtAuthGuard } from 'src/shared/guards';

/**
 * ? @Module
 * + Decorator que marca uma classe como um Módulo. O Nest utiliza esses módulos para organizar a aplicação
 * + em escopos.
 *
 */

@Module({
  imports: [
    JwtModule.register({
      signOptions: { expiresIn: process.env.JWT_EXPIREIN },
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CheckIfUserExistsService,
    BcryptService,
    JwStrategy,
    JwtAuthGuard,
  ],
})
export class AuthModule { }
