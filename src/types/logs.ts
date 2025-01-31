export type PinoLevel = 10 | 20 | 30 | 40 | 50;

export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

export type LogCategory = 
  | 'AUTH'
  | 'API'
  | 'DB'
  | 'SECURITY'
  | 'PERFORMANCE'
  | 'SYSTEM'
  | 'ACCESS'
  | 'ADMIN';

export interface LogEntry {
  level: PinoLevel;
  time?: string;
  timestamp?: string;
  msg?: string;
  message?: string;
  category: LogCategory;
  details?: Record<string, unknown>;
}

export interface LogResponse {
  logs: LogEntry[];
  total: number;
  limit: number;
  categories: LogCategory[];
}

export interface LogQueryParams {
  category?: LogCategory;
  level?: LogLevel;
  limit?: number;
  search?: string;
}