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
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
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