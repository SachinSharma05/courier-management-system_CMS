import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@UseGuards(JwtAuthGuard)
@Controller('/admin/profile')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get()
  getProfile(@Req() req: any) {
    return this.service.getProfile(req.user.sub);
  }

  @Patch()
  updateProfile(
    @Req() req: any,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.service.updateProfile(req.user.sub, dto);
  }
}
