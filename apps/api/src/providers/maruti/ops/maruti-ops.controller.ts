import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { MarutiService } from "../maruti.service";
import { MarutiDrsUpdateDto } from "../dto/ops/drs/maruti-drs-update.dto";
import { MarutiCreateDrsDto } from "../dto/ops/drs/maruti-create-drs.dto";
import { MarutiDrsListDto } from "../dto/ops/drs/maruti-drs-list.dto";
import { MarutiValidateAwbDto } from "../dto/ops/drs/maruti-validate-awb.dto";
import { MarutiPrsCreateDto } from "../dto/ops/prs/maruti-prs-create.dto";
import { MarutiPrsUpdateScannedDto } from "../dto/ops/prs/maruti-prs-update-scanned.dto";
import { MarutiPrsUpdateStatusDto } from "../dto/ops/prs/maruti-prs-update-status.dto";
import { MarutiPrsListDto } from "../dto/ops/prs/maruti-prs-list.dto";

@Controller('/admin/maruti/ops')
export class MarutiOpsController {
  constructor(private readonly service: MarutiService) {}

  @Post('/drs/update')
  updateDrs(@Body() dto: MarutiDrsUpdateDto) {
    return this.service.updateDrsStatus(dto);
  }

  @Post('/drs/create')
  async createDrs(@Body() dto: MarutiCreateDrsDto) {
    return this.service.createDrs(dto);
  }

  @Get('/drs/list')
  async getDrsList(
    @Query() dto: MarutiDrsListDto,
  ) {
    return this.service.getDrsShipmentList(dto);
  }

  @Post('/drs/validate-awbs')
  async validateAwbs(
    @Body() dto: MarutiValidateAwbDto,
  ) {
    return this.service.validateAwbs(dto);
  }

  @Post('/prs/create')
  async createPrs(@Body() dto: MarutiPrsCreateDto) {
    return this.service.createPrs(dto);
  }

  @Patch('/prs/update-scanned')
  async updatePrsScanned(
    @Body() dto: MarutiPrsUpdateScannedDto,
  ) {
    return this.service.updatePrsScannedStatus(dto);
  }

  @Patch('/prs/update-status')
  async updatePrsStatus(
    @Body() dto: MarutiPrsUpdateStatusDto,
  ) {
    return this.service.updatePrsStatus(dto);
  }

  @Get('/prs/:prsNumber/orders')
  async getAllPrsOrders(
    @Param() dto: MarutiPrsListDto,
  ) {
    return this.service.getAllPrsOrders(dto);
  }
}
