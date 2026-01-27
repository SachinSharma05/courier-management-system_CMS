import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ComplaintsService } from "./complaints.service";
import { CreateComplaintDto } from "./dto/create-complaint.dto";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly service: ComplaintsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateComplaintDto) {
    return this.service.create(req.user.sub, dto);
  }

  @Get('my')
  getMy(@Req() req: any) {
    return this.service.findMyComplaints(req.user.sub);
  }
}