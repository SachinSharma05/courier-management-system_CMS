import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import fetchCookie from 'fetch-cookie';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const fetchWithCookies = fetchCookie(fetch, jar);

@Injectable()
export class DelhiveryBulkAdapter {

  private BASE='https://track.delhivery.com'
  private TOKEN='fdf1ec596cae5feec6685c57a7285f7637b771f5'

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

    const headers = {
      Authorization: `Token ${this.TOKEN}`,
      "Content-Type": "application/json",
    };

    const res = await fetchWithCookies(url.toString(), {
      method,
      headers,
    });

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  async trackBulk(awbs: string[]) {
    return this.call('/api/v1/packages/json/', 'GET', undefined, {
      waybill: awbs.join(','),
    });
  }

  trackSingle(awb: string) {
    return this.call('/api/v1/packages/json/', 'GET', undefined, {
      waybill: awb,
    });
  }
}