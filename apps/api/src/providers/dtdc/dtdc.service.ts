import { Injectable, BadRequestException } from '@nestjs/common';
import { sql, desc, eq } from 'drizzle-orm';
import { consignments, users } from '../../db/schema';
import { db } from '../../db';
import { computeMovement, computeTAT } from '../../admin/consignments/tat.engine';

@Injectable()
export class DtdcService {
    
}