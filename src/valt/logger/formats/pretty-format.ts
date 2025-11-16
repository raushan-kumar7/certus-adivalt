import { LogEntry, LogLevel, LoggerConfig } from '@/types';

export class PrettyFormat {
  private colors = {
    [LogLevel.ERROR]: '\x1b[31m', // Red
    [LogLevel.WARN]: '\x1b[33m', // Yellow
    [LogLevel.INFO]: '\x1b[36m', // Cyan
    [LogLevel.DEBUG]: '\x1b[35m', // Magenta
    [LogLevel.TRACE]: '\x1b[90m', // Gray
  };

  private reset = '\x1b[0m';

  constructor(private config: Required<LoggerConfig>) {}

  format(entry: LogEntry): string {
    const timestamp = this.formatTimestamp(entry.timestamp);
    const level = LogLevel[entry.level].padEnd(5);
    const color = this.colors[entry.level] || this.reset;

    let output = `${color}[${timestamp}] ${level} ${this.config.service}: ${entry.message}${this.reset}`;

    // Add context if present
    if (entry.context && Object.keys(entry.context).length > 0) {
      output += `\n${color}  Context: ${JSON.stringify(entry.context, null, 2)}${this.reset}`;
    }

    // Add error if present
    if (entry.error) {
      output += `\n${color}  Error: ${entry.error.name}: ${entry.error.message}`;
      if (entry.error.stack && this.config.environment === 'development') {
        output += `\n${color}  Stack: ${entry.error.stack}${this.reset}`;
      }
    }

    // Add duration if present
    if (entry.duration) {
      output += `\n${color}  Duration: ${entry.duration}ms${this.reset}`;
    }

    return output;
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
