import { Controller, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DisableUserDto } from './dto/user-input.dto';

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Put(':id_user_ad/disable')
  disable(@Param() userDto: DisableUserDto) {
    return this.usersService.disableUser(userDto.id_user_ad);
  }
}
