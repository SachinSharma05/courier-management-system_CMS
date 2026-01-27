import { Body, Controller, Get, Param, ParseIntPipe, Patch, Req, UseGuards } from "@nestjs/common";
import { Roles } from "../../common/decorators/roles.decorator";
import { ComplaintsService } from "./complaints.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { UpdateComplaintStatusDto } from "./dto/update-complaint-status.dto";

@Roles('admin', 'super_admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/complaints')
export class AdminComplaintsController {
  constructor(private readonly service: ComplaintsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id')
    @Roles('admin', 'super_admin', 'support')
    async updateStatus(
    @Param('id') id: number,
    @Body()
    body: {
        status: 'open' | 'in_progress' | 'resolved';
        resolution_comment?: string;
    },
    ) {
    return this.service.updateStatus(
        Number(id),
        body.status,
        body.resolution_comment,
    );
    }
}