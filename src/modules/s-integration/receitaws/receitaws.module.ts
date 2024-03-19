import { Module } from '@nestjs/common';
import { ReceitawsService } from './receitaws.service';

@Module({
  providers: [ReceitawsService],
})
export class ReceitawsModule {}
