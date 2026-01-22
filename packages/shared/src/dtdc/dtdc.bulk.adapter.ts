import { Injectable } from "@nestjs/common";
import fetch from "node-fetch";
import fetchCookie from "fetch-cookie";
import { CookieJar } from "tough-cookie";

const jar = new CookieJar();
const cookieFetch = fetchCookie(fetch, jar);

@Injectable()
export class DtdcBulkAdapter {
  private AUTH_URL =
    "https://blktracksvc.dtdc.com/dtdc-api/rest/JSONCnTrk/getTrackDetails";

  private PUBLIC_URL =
    "https://www.dtdc.com/wp-json/custom/v1/domestic/track-multi";

  private TRACK_URL =
  "https://www.dtdc.com/wp-json/custom/v1/domestic/track";

  /* ----------------------------------
     AUTH TRACK (SINGLE AWB)
  ---------------------------------- */
  async trackAuthSingle(params: {
  awb: string;
  token: string;
  customerCode: string;
  }) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);

    try {
      const res = await fetch(this.AUTH_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "X-Access-Token": params.token,
        },
        body: JSON.stringify({
          trkType: "cnno",
          strcnno: params.awb,          // ✅ SINGLE AWB
          addtnlDtl: "Y",
          customerCode: params.customerCode,
        }),
      });

      if (!res.ok) {
        // 206 is still a valid DTDC response
        if (res.status !== 206) {
          throw new Error(`DTDC AUTH failed: ${res.status}`);
        }
      }

      const text = await res.text();
      if (!text) return null;

      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error("DTDC AUTH invalid JSON");
      }

      // 🚫 Guard: DTDC returns FAILED with empty payload
      if (json.statusFlag === false) return null;
      if (!json.trackHeader) return null;

      return json;

    } finally {
      clearTimeout(timeout);
    }
  }

  /* ----------------------------------
     PUBLIC TRACK (BATCH)
  ---------------------------------- */
  async trackPublicBatch(awbs: string[]) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 30000);

    const res = await cookieFetch(this.PUBLIC_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
        "Origin": "https://www.dtdc.com",
        "Referer": "https://www.dtdc.com/track-shipment/",
        "Accept-Encoding": "gzip, deflate, br",
      },
      body: JSON.stringify({
        trackType: "cnno",
        trackNos: awbs, // MUST be array
      }),
    });

    const text = await res.text();

    // DTDC sometimes returns HTML (WAF / captcha)
    if (!text || text.startsWith("<")) {
      return { headers: [] };
    }

    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      return { headers: [] };
    }

    // DTDC ALWAYS lies with HTTP 200
    if (!json || json.statusCode !== 200) {
      return { headers: [] };
    }

    // Normalize null → []
    if (!Array.isArray(json.headers)) {
      json.headers = [];
    }

    return json;
  }

  /* ----------------------------------
   PUBLIC TRACK (SINGLE AWB – TIMELINE)
  ---------------------------------- */
  async trackPublicSingle(awb: string) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 25000);

    const res = await cookieFetch(this.TRACK_URL,
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
          "Origin": "https://www.dtdc.com",
          "Referer": "https://www.dtdc.com/track-shipment/",
        },
        body: JSON.stringify({
          trackType: "cnno",
          trackNumber: awb, // 🔴 SINGLE ONLY
        }),
      },
    );

    const text = await res.text();

    // WAF / captcha / invalid
    if (!text || text.startsWith("<")) {
      return null;
    }

    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      return null;
    }

    // Public single-track success contract
    if (json?.statusCode !== 200 || !json?.header) {
      return null;
    }

    return json;
  }
}