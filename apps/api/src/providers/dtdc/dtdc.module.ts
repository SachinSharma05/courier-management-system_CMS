import { Module } from '@nestjs/common';
import { DtdcController } from './dtdc.controller';
import { DtdcService } from './dtdc.service';

@Module({
    controllers: [DtdcController],
    providers: [DtdcService],
    exports: [DtdcService],
})

export class DtdcModule {}