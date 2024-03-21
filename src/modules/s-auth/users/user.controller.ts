import { Controller, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Put(':id_user_ad/disable')
  disable(@Param('id_user_ad') idUserAd: string) {
    return this.usersService.disableUser(idUserAd);
  }
}
