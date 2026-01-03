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
import { AdvancesService } from "./advances/advances.service";
import { AdvancesController } from "./advances/advances.controller";
import { PayslipController } from "./payslip/payslip.controller";
import { PayslipService } from "./payslip/payslip.service";
import { SalaryPaymentsService } from "./salary-payments/salary-payments.service";
import { SalaryPaymentsController } from "./salary-payments/salary-payments.controller";

@Module({
    controllers: [
        EmployeesController, 
        HolidaysController, 
        AttendanceController, 
        LeavesController, 
        SalaryController,
        AdvancesController,
        PayslipController,
        SalaryPaymentsController
    ],
    providers: [
        EmployeesService,
        HolidaysService,
        AttendanceService,
        LeavesService,
        SalaryService,
        AdvancesService,  
        PayslipService,
        SalaryPaymentsService  
    ],
})

export class EmployeesModule {}