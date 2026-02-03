import { Module } from '@nestjs/common';
import { MarutiService } from './maruti.service';
import { MarutiController } from './maruti.controller';

@Module({
  controllers: [MarutiController],
  providers: [MarutiService],
})

export class MarutiModule {}