import { Module } from '@nestjs/common';
import { ComplaintsController } from "./complaints.controller";
import { AdminComplaintsController } from "./admin-complaints.controller";
import { ComplaintsService } from "./complaints.service";

@Module({
  controllers: [
    ComplaintsController,
    AdminComplaintsController,
  ],
  providers: [ComplaintsService],
})

export class ComplaintsModule {}
