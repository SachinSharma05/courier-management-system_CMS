import { Controller, Get, Post, Query, Body, BadRequestException } from '@nestjs/common';
import { DtdcService } from './dtdc.service';

@Controller('providers/dtdc')
export class DtdcController {
    constructor(private readonly service: DtdcService) {}

}