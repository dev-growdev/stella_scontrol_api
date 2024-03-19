import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dtos';
import { JwtAuthGuard } from '@/shared/guards';
import { User } from '@/shared/decorators/user.decorator';

@Controller()
// @UseGuards(JwtAuthGuard)
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
