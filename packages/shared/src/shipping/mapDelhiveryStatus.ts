import { NormalizedStatus, StatusGroup } from "./dtdc-status";

export function mapDelhiveryStatus(raw: string): {
  normalized: NormalizedStatus;
  group: StatusGroup;
} {
  const s = (raw ?? '').toLowerCase();

  if (s.includes('delivered')) {
    return { normalized: 'DELIVERED', group: 'delivered' };
  }

  if (s.includes('rto')) {
    return { normalized: 'RTO', group: 'rto' };
  }

  if (
    s.includes('undelivered') ||
    s.includes('not delivered') ||
    s.includes('ndr') ||
    s.includes('failed')
  ) {
    return { normalized: 'NDR', group: 'ndr' };
  }

  if (
    s.includes('in transit') ||
    s.includes('out for delivery') ||
    s.includes('picked') ||
    s.includes('manifest') ||
    s.includes('dispatched')
  ) {
    return { normalized: 'IN_TRANSIT', group: 'in_transit' };
  }

  return { normalized: 'UNKNOWN', group: 'other' };
}
