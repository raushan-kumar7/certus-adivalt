import { LogEntry, LoggerConfig, LogLevel } from '@/types';

export class JsonFormat {
  constructor(private config: Required<LoggerConfig>) {}

  format(entry: LogEntry): string {
    const formattedEntry = {
      timestamp: this.formatTimestamp(entry.timestamp),
      level: LogLevel[entry.level],
      service: entry.service,
      environment: entry.environment,
      version: entry.version,
      message: entry.message,
      ...(entry.context && { context: entry.context }),
      ...(entry.error && { error: entry.error }),
      ...(entry.duration && { duration: entry.duration }),
      ...(entry.requestId && { requestId: entry.requestId }),
      ...(entry.userId && { userId: entry.userId }),
      ...(entry.sessionId && { sessionId: entry.sessionId }),
    };

    return JSON.stringify(formattedEntry);
  }

  private formatTimestamp(timestamp: Date): string {
    switch (this.config.timestampFormat) {
      case 'ISO':
        return timestamp.toISOString();
      case 'UTC':
        return timestamp.toUTCString();
      case 'LOCAL':
        return timestamp.toLocaleString();
      default:
        return timestamp.toISOString();
    }
  }
}
