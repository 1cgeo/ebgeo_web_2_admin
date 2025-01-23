export interface SystemHealth {
    status: 'healthy' | 'unhealthy' | 'degraded';
    timestamp: Date;
    environment: string;
    uptime: number;
    services: {
      database: ServiceHealth;
      fileSystem: ServiceHealth;
      auth: ServiceHealth;
      api: ServiceHealth;
    };
    memory: {
      used: number;
      total: number;
      percentUsed: number;
    };
  }
  
  export interface ServiceHealth {
    status: 'healthy' | 'unhealthy' | 'degraded';
    details?: Record<string, unknown>;
    lastCheck: Date;
  }
  
  export interface SystemMetrics {
    system: {
      uptime: number;
      nodeVersion: string;
      environment: string;
      memory: {
        total: number;
        used: number;
        free: number;
      };
      cpu: {
        usage: number;
        loadAvg: number[];
      };
    };
    database: {
      connectionPool: {
        total: number;
        active: number;
        idle: number;
      };
    };
    usage: {
      totalUsers: number;
      activeUsers: number;
      totalGroups: number;
      totalModels: {
        total: number;
        public: number;
        private: number;
      };
    };
    logs: {
      errors24h: number;
      warnings24h: number;
      totalRequests24h: number;
    };
  }
  
  export interface LogQueryParams {
    startDate?: string;
    endDate?: string;
    level?: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
  
  export interface LogEntry {
    timestamp: string;
    level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
    category: string;
    message: string;
    details?: Record<string, unknown>;
  }
  
  export interface LogResponse {
    logs: LogEntry[];
    total: number;
    page: number;
    limit: number;
  }
  
  export interface AuditQueryParams {
    startDate?: string;
    endDate?: string;
    action?: string;
    actorId?: string;
    targetId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
  
  export interface AuditEntry {
    id: string;
    timestamp: Date;
    action: string;
    actor: {
      id: string;
      username: string;
    };
    target?: {
      type: 'USER' | 'GROUP' | 'MODEL' | 'ZONE' | 'SYSTEM';
      id: string;
      name: string;
    };
    details: Record<string, unknown>;
    ip: string;
    userAgent?: string;
  }
  
  export interface AuditResponse {
    entries: AuditEntry[];
    total: number;
    page: number;
    limit: number;
  }