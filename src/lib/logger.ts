type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
};

const RESET = '\x1b[0m';
const GRAY = '\x1b[90m';
const BOLD = '\x1b[1m';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: unknown;
}

const isServer = typeof window === 'undefined';

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'debug';

function getTimestamp(): string {
  return new Date().toISOString();
}

function formatEntry(entry: LogEntry): string {
  const time = isServer
    ? `${GRAY}${entry.timestamp}${RESET}`
    : entry.timestamp;

  const color = isServer ? LEVEL_COLORS[entry.level] : '';
  const levelTag = `${color}${BOLD}[${entry.level.toUpperCase()}]${RESET}`;
  const contextTag = entry.context ? ` ${GRAY}[${entry.context}]${RESET}` : '';
  const dataStr = entry.data !== undefined
    ? `\n${GRAY}${JSON.stringify(entry.data, null, 2)}${RESET}`
    : '';

  return `${time} ${levelTag}${contextTag} ${entry.message}${dataStr}`;
}

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] >= LEVELS[currentLevel];
}

const storedEntries: LogEntry[] = [];
const MAX_STORED = 200;

function store(entry: LogEntry): void {
  storedEntries.push(entry);
  if (storedEntries.length > MAX_STORED) {
    storedEntries.shift();
  }
}

function log(level: LogLevel, message: string, context?: string, data?: unknown): void {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    level,
    message,
    timestamp: getTimestamp(),
    ...(context && { context }),
    ...(data !== undefined && { data }),
  };

  store(entry);

  if (isServer) {
    const fn = level === 'error' ? console.error
      : level === 'warn' ? console.warn
      : console.log;
    fn(formatEntry(entry));
  } else {
    const fn = level === 'error' ? console.error
      : level === 'warn' ? console.warn
      : level === 'debug' ? console.debug
      : console.log;
    fn(`[${entry.level.toUpperCase()}]${context ? ` [${context}]` : ''} ${entry.message}`, data ?? '');
  }
}

export const logger = {
  debug: (message: string, context?: string, data?: unknown) => log('debug', message, context, data),
  info: (message: string, context?: string, data?: unknown) => log('info', message, context, data),
  warn: (message: string, context?: string, data?: unknown) => log('warn', message, context, data),
  error: (message: string, context?: string, data?: unknown) => log('error', message, context, data),

  getStored: (): LogEntry[] => [...storedEntries],

  getStoredByLevel: (level: LogLevel): LogEntry[] =>
    storedEntries.filter(e => e.level === level),

  clearStored: (): void => {
    storedEntries.length = 0;
  },
};
