import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CardHolderParams {
  @IsNotEmpty()
  @IsString()
  @IsIn(['credit', 'corporate'])
  type: 'credit' | 'corporate';
}
