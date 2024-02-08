import { Controller, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Delete(':id_user_ad')
  remove(@Param('id_user_ad') id_user_ad: string) {
    return this.usersService.remove(id_user_ad);
  }
}
