import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {}

export class DisableUserDto {
  @IsNotEmpty()
  @IsString()
  id_user_ad: string;
}
