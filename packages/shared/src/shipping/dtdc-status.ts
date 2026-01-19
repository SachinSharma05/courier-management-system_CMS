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

  // 🔁 RTO
  if (s.includes('rto') || s.includes('return') || s.includes('rtb')) {
    if (s.includes('delivered')) {
      return { normalized: 'RTO_DELIVERED', group: 'delivered' };
    }
    return { normalized: 'RTO', group: 'rto' };
  }

  // ⚠️ NDR
  if (
    s.includes('undelivered') ||
    s.includes('not delivered') ||
    s.includes('contact customer') ||
    s.includes('refused')
  ) {
    return { normalized: 'NDR', group: 'ndr' };
  }

  // ✅ Delivered (ONLY exact intent)
  if (s === 'delivered') {
    return { normalized: 'DELIVERED', group: 'delivered' };
  }

  // 🚚 Active
  if (
    s.includes('in transit') ||
    s.includes('out for delivery') ||
    s.includes('processing') ||
    s.includes('destination') ||
    s.includes('reached') ||
    s.includes('scheduled')
  ) {
    return { normalized: 'IN_TRANSIT', group: 'in_transit' };
  }

  if (s.includes('lost') || s.includes('damage')) {
    return { normalized: 'LOST', group: 'other' };
  }

  if (s.includes('cancel')) {
    return { normalized: 'CANCELLED', group: 'other' };
  }

  return { normalized: 'UNKNOWN', group: 'other' };
}