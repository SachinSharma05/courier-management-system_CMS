export function safe(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, v) =>
      typeof v === 'string' && v.length > 30 ? '[REDACTED]' : v,
    ),
  );
}