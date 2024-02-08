import { Controller, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Put(':id_user_ad/disable')
  disable(@Param('id_user_ad') id_user_ad: string) {
    return this.usersService.disableUser(id_user_ad);
  }
}
