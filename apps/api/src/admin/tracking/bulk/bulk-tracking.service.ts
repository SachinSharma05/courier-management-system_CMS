import { Injectable } from "@nestjs/common";
import { BulkGroupDto } from "./bulk-tracking.dto";
import { db } from "../../../db";
import { clientCredentials, consignments } from "../../../db/schema";
import { decrypt } from "../../../utils/crypto";
import { sql } from "drizzle-orm";

function safeDate(input: any): Date | null {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

@Injectable()
export class BulkTrackingService {
  async processDtdcBulk(groups: BulkGroupDto[]) {
    const results: any[] = [];

    /* ---------------------------------------------------
       1️⃣ PRELOAD CUSTOMER CODE → CLIENT ID MAP (ONCE)
    --------------------------------------------------- */
    const credRows = await db
      .select({
        client_id: clientCredentials.client_id,
        env_key: clientCredentials.env_key,
        encrypted_value: clientCredentials.encrypted_value,
      })
      .from(clientCredentials)
      .where(sql`${clientCredentials.env_key} = 'DTDC_CUSTOMER_CODE'`);

    const codeToClientId = new Map<string, number>();
    for (const r of credRows) {
      const code = decrypt(r.encrypted_value).trim().toUpperCase();
      codeToClientId.set(code, r.client_id);
    }

    /* ---------------------------------------------------
       2️⃣ PROCESS EACH GROUP
    --------------------------------------------------- */
    for (const group of groups) {
      const customerCode = group.code.trim().toUpperCase();
      const awbRows = group.awbs
      .filter(a => a.awb)
      .map(a => ({
        awb: a.awb.trim(),
        reference_number: a.reference_number ?? null,
        origin_pincode: a.origin_pincode ?? null,
        destination_pincode: a.destination_pincode ?? null,
        booked_at: safeDate(a.booked_at),
      }));

      if (!awbRows.length) continue;

      const clientId = codeToClientId.get(customerCode) ?? 1;

      /* ---------------------------------------------------
         3️⃣ BUILD INSERT ROWS (METADATA ONLY)
      --------------------------------------------------- */
      const rows = awbRows.map(a => ({
        awb: a.awb,
        client_id: clientId,
        provider: 'DTDC',

        reference_number: a.reference_number,
        origin_pincode: a.origin_pincode,
        destination_pincode: a.destination_pincode,
        booked_at: a.booked_at,

        current_status: null,
        normalized_status: null,
        status_group: null,
        last_status_at: null,

        updated_at: sql`NOW()`,
      }));

      /* ---------------------------------------------------
         4️⃣ NEON-SAFE UPSERT (SINGLE QUERY)
      --------------------------------------------------- */
      await db
        .insert(consignments)
        .values(rows)
        .onConflictDoUpdate({
          target: consignments.awb,
          set: {
            client_id: sql`EXCLUDED.client_id`,
            provider: sql`EXCLUDED.provider`,

            reference_number: sql`COALESCE(${consignments.reference_number}, EXCLUDED.reference_number)`,
            origin_pincode: sql`COALESCE(${consignments.origin_pincode}, EXCLUDED.origin_pincode)`,
            destination_pincode: sql`COALESCE(${consignments.destination_pincode}, EXCLUDED.destination_pincode)`,
            booked_at: sql`COALESCE(${consignments.booked_at}, EXCLUDED.booked_at)`,

            updated_at: sql`NOW()`,
          },
        });

      results.push({
        customerCode,
        clientId,
        uploaded: awbRows.length,
        saved: rows.length,
      });
    }

    return { ok: true, results };
  }
}