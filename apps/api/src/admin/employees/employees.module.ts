import { Module } from "@nestjs/common";
import { EmployeesController } from "./employees.controller";
import { EmployeesService } from "./employees.service";
import { HolidaysController } from "./holidays/holidays.controller";
import { AttendanceController } from "./attendance/attendance.controller";
import { LeavesController } from "./leaves/leaves.controller";
import { SalaryController } from "./salary/salary.controller";
import { HolidaysService } from "./holidays/holidays.service";
import { AttendanceService } from "./attendance/attendance.service";
import { LeavesService } from "./leaves/leaves.service";
import { SalaryService } from "./salary/salary.service";

@Module({
    controllers: [
        EmployeesController, 
        HolidaysController, 
        AttendanceController, 
        LeavesController, 
        SalaryController
    ],
    providers: [
        EmployeesService,
        HolidaysService,
        AttendanceService,
        LeavesService,
        SalaryService    
    ],
    exports: [EmployeesService],
})

export class EmployeesModule {}