import fetch from 'node-fetch';

export class DelhiveryBulkAdapter {
  private BASE = (process.env.DELHIVERY_C2C_BASE || 'https://track.delhivery.com').replace(/\/$/, '');
  private TOKEN = (process.env.DELHIVERY_C2C_TOKEN || '').trim();

  private async call(
    path: string,
    method: 'GET' | 'POST' = 'GET',
    body?: any,
    query?: Record<string, any>
  ) {
    const url = new URL(this.BASE + path);

    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null) {
          url.searchParams.set(k, String(v));
        }
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Token ${this.TOKEN}`,
    };

    let payload: any;

    if (method !== 'GET') {
      headers['Content-Type'] = 'application/json';
      payload = body ? JSON.stringify(body) : undefined;
    }

    const res = await fetch(url.toString(), {
      method,
      headers,
      body: payload,
    });

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  /* =======================
     BULK TRACK (25 max)
  ======================= */
  trackBulk(awbs: string[]) {
    return this.call('/api/v1/packages/json/', 'GET', undefined, {
      waybill: awbs.join(','),
    });
  }

  /* =======================
     SINGLE TRACK (worker)
  ======================= */
  trackSingle(awb: string) {
    return this.call('/api/v1/packages/json/', 'GET', undefined, {
      waybill: awb,
    });
  }
}