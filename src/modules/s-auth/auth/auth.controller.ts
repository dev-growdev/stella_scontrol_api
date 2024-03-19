import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/shared/guards';
import { User } from '@/shared/decorators/user.decorator';
import { AuthService } from './auth.service';
import { AuthDTO } from './dtos/auth-input.dto';

@ApiTags('Autenticação')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signin(@Body() loginDto: AuthDTO) {
    return this.authService.signin(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth')
  token(@User() user: any) {
    return this.authService.getUserByUid(user.uid);
  }
}
