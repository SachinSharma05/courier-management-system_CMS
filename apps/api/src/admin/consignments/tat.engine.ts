import dayjs from 'dayjs';

const TAT_4D = ['M', 'X', 'V', '7X', '7V'];
const TAT_6D = ['D', '7D', 'I'];

function resolveTATSeriesRule(awb: string): number {
  if (!awb) return 5;

  const prefix2 = awb.substring(0, 2).toUpperCase();
  if (TAT_4D.includes(prefix2)) return 4;
  if (TAT_6D.includes(prefix2)) return 6;

  const prefix1 = awb.charAt(0).toUpperCase();
  if (TAT_4D.includes(prefix1)) return 4;
  if (TAT_6D.includes(prefix1)) return 6;

  return 5;
}

function isDelivered(status?: string | null) {
  return status === 'DELIVERED';
}

export function computeTAT(
  awb: string,
  bookedOn?: Date | null,
  lastStatus?: string | null,
) {
  if (isDelivered(lastStatus)) return 'Delivered';
  if (!bookedOn) return 'On Time';

  const days = dayjs().diff(dayjs(bookedOn), 'day');
  const rule = resolveTATSeriesRule(awb);

  if (days >= rule + 3) return 'Sensitive';
  if (days >= rule + 2) return 'Critical';
  if (days >= rule + 1) return 'Warning';
  return 'On Time';
}

export function computeMovement(
  lastEventAt?: Date | null,
  lastStatus?: string | null,
) {
  if (isDelivered(lastStatus)) return 'Delivered';
  if (!lastEventAt) return 'On Time';

  const hours = (Date.now() - lastEventAt.getTime()) / (1000 * 60 * 60);

  if (hours >= 72) return 'Sensitive';
  if (hours >= 48) return 'Critical';
  if (hours >= 24) return 'Warning';
  return 'On Time';
}