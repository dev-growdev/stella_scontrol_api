import { ERoleType } from 'src/shared/enums';

export interface UserDTO {
  uid: string;
  name: string;
  phone: string;
  document?: string;
  enable: boolean;
  role: ERoleType;
}

export class CreateUserDto {}

import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
