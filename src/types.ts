export interface ThreatEvent {
  id: string;
  timestamp: string;
  type: 'malware' | 'phishing' | 'ddos' | 'intrusion';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  destination: string;
  description: string;
  status: 'active' | 'mitigated' | 'investigating';
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  networkTraffic: number;
  activeConnections: number;
}

export interface AnomalyScore {
  timestamp: string;
  score: number;
}

export interface ThreatStats {
  total: number;
  active: number;
  mitigated: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
}