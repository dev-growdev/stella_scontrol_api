import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dtos';

/**
 * ? @Controller(prefix: string)
 * + Decorator que marca uma classe como uma Controller. O parâmetro prefix define um prefixo para as rotas desta controller.
 * + Ex: @Controller('auth') - /auth/users
 *
 * ? @Post(params?)
 * + Decorator @Post é um handler de rotas e representa o método HTTP da requisição.
 * + Pode, opcionalmente, receber via parâmetro um path que representa o nome da rota que será chamada.
 * + Ex: @Post('users') - Representa uma chamada para a rota /users usando o método HTTP Post.
 *
 * ? @Body
 * + É um handler que extrai o body da request e popula o decorator com o valor do body.
 * + É um decorator do nest que abstrai se o routing da aplicação é feito via express, fastfy, etc.
 *
 */

@Controller()
// @UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  signin(@Body() loginDto: AuthDTO) {

    return this.authService.signin(loginDto);
  }
}
