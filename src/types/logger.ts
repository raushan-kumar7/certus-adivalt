import { BaseContext, LogLevel } from './common';

export interface LogEntry extends BaseContext {
  level: LogLevel;
  message: string;
  service: string;
  environment: string;
  version: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
    statusCode?: number;
  };
  duration?: number;
}

export interface LoggerConfig {
  level: LogLevel;
  service: string;
  environment: string;
  version?: string;
  redactFields?: string[];
  prettyPrint?: boolean;
  timestampFormat?: string;
}
