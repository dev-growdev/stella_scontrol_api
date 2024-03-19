import { PartialType } from '@nestjs/mapped-types';

export class UserDto {
  uid: string;
  name: string;
  phone: string;
  document?: string;
  enable: boolean;
}

export class CreateUserDto {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
