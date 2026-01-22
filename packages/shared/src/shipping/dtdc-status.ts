export type NormalizedStatus =
  | 'DELIVERED'
  | 'IN_TRANSIT'
  | 'NDR'
  | 'RTO'
  | 'RTO_DELIVERED'
  | 'CANCELLED'
  | 'LOST'
  | 'UNKNOWN';

export type StatusGroup =
  | 'delivered'
  | 'in_transit'
  | 'ndr'
  | 'rto'
  | 'other';

export function mapDtdcStatus(raw: string): {
  normalized: NormalizedStatus;
  group: StatusGroup;
} {
  const s = (raw ?? '').toLowerCase().trim();

  // 1️⃣ Terminal States (Canceled/Lost)
  if (s.includes('cancel')) return { normalized: 'CANCELLED', group: 'other' };
  if (s.includes('lost') || s.includes('damage')) return { normalized: 'LOST', group: 'other' };

  // 2️⃣ RTO Logic (Highest priority for specialized handling)
  if (s.includes('rto') || s.includes('return') || s.includes('rtb')) {
    if (s.includes('delivered')) {
      return { normalized: 'RTO_DELIVERED', group: 'delivered' };
    }
    return { normalized: 'RTO', group: 'rto' };
  }

  // 3️⃣ NDR (Non-Delivery Report)
  if (
    s.includes('undelivered') ||
    s.includes('not delivered') ||
    s.includes('contact customer') ||
    s.includes('refused') ||
    s.includes('could not') ||
    s.includes('re-attempt')
  ) {
    return { normalized: 'NDR', group: 'ndr' };
  }

  // 4️⃣ Delivered (Changed from strict '===' to '.includes')
  if (s.includes('delivered')) {
    return { normalized: 'DELIVERED', group: 'delivered' };
  }

  // 5️⃣ Active / In-Transit
  if (
    s.includes('in transit') ||
    s.includes('out for delivery') ||
    s.includes('processing') ||
    s.includes('destination') ||
    s.includes('reached') ||
    s.includes('scheduled') ||
    s.includes('dispatched') ||
    s.includes('booked') ||
    s.includes('manifest')
  ) {
    return { normalized: 'IN_TRANSIT', group: 'in_transit' };
  }

  return { normalized: 'UNKNOWN', group: 'other' };
}