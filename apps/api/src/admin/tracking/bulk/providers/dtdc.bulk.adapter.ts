import { Injectable } from "@nestjs/common";

@Injectable()
export class DtdcBulkAdapter {
  private AUTH_URL =
    'https://blktracksvc.dtdc.com/dtdc-api/rest/JSONCnTrk/getTrackDetails';

  private PUBLIC_URL =
    'https://www.dtdc.com/wp-json/custom/v1/domestic/track';

  async trackBatch(params: {
    awbs: string[];
    credentials?: {
      token?: string;
      customerCode?: string;
    };
  }) {
    const { awbs, credentials } = params;

    // 🔐 AUTH FIRST
    if (credentials?.token && credentials?.customerCode) {
      try {
        return await this.trackWithAuth(awbs, {
          token: credentials.token,
          customerCode: credentials.customerCode,
        });
      } catch (err: any) {
        console.warn(
          'DTDC AUTH FAILED → Falling back to PUBLIC API',
          err?.message,
        );
      }
    }

    // 🌐 PUBLIC FALLBACK
    return this.trackWithPublicApi(awbs);
  }

  /* ---------------------------------- */
  /* CPDP AUTH API */
  /* ---------------------------------- */
  private async trackWithAuth(
    awbs: string[],
    creds: { token: string; customerCode: string },
  ) {
    const res = await fetch(this.AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": creds.token!,
      },
      body: JSON.stringify({
        trkType: 'cnno',
        strcnno: awbs.join(','),
        addtnlDtl: 'Y',
        customerCode: creds.customerCode,
      }),
    });

    const text = await res.text();
    const json = JSON.parse(text);

    if (json.status === 'FAILED' || json.statusFlag === false) {
      throw new Error('DTDC CPDP business failure');
    }

    // ✅ RETURN RAW JSON ONLY
    return json;
  }

  /* ---------------------------------- */
  /* PUBLIC GUEST API */
  /* ---------------------------------- */
  private async trackWithPublicApi(awbs: string[]) {
    console.log("Public AWBs", awbs)
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 12000);

    const res = await fetch(this.PUBLIC_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trackNumber: awbs.join(','),
        trackType: 'cnno',
      }),
    });

    const text = await res.text();

    if (text.startsWith('<')) {
      // captcha / html block
      return awbs.map(awb => ({
        awb,
        raw: null,
      }));
    }

    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      return awbs.map(awb => ({
        awb,
        raw: null,
      }));
    }

    // Normalize response to per-AWB rows
    return awbs.map((awb, index) => ({
      awb,
      raw: Array.isArray(json) ? json[index] ?? null : json,
    }));
  }
}