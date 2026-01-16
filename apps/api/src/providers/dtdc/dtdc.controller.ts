import { Controller, Get, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { ListShipmentsDto } from '../delhivery/dto/list-shipments.dto';
import { DtdcService } from './dtdc.service';

@Controller('providers/dtdc')
export class DtdcController {
    constructor(private readonly service: DtdcService) {}

    @Get('list')
    getShipments(@Query() query: ListShipmentsDto) {
    return this.service.listShipments('DTDC', query);
    }
}