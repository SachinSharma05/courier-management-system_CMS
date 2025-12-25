type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  level: LogLevel;
  msg: string;
  provider?: string;
  clientId?: number;
  awb?: string;
  error?: unknown;
  meta?: Record<string, unknown>;
}

function log(payload: LogPayload) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      ...payload,
    })
  );
}

export const logger = {
  info: (msg: string, meta?: Partial<LogPayload>) =>
    log({ level: 'info', msg, ...meta }),

  warn: (msg: string, meta?: Partial<LogPayload>) =>
    log({ level: 'warn', msg, ...meta }),

  error: (msg: string, meta?: Partial<LogPayload>) =>
    log({ level: 'error', msg, ...meta }),
};