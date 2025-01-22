import { ThreatEvent, SystemMetrics, AnomalyScore } from '../types';

let threatCounter = 0;

export const generateMockThreatEvents = (): ThreatEvent[] => {
  const types = ['malware', 'phishing', 'ddos', 'intrusion'];
  const severities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['active', 'mitigated', 'investigating'];

  return Array.from({ length: 10 }, () => {
    const uniqueId = `threat-${Date.now()}-${threatCounter++}`;
    return {
      id: uniqueId,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      type: types[Math.floor(Math.random() * types.length)] as ThreatEvent['type'],
      severity: severities[Math.floor(Math.random() * severities.length)] as ThreatEvent['severity'],
      source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      destination: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      description: `Potential ${types[Math.floor(Math.random() * types.length)]} attack detected`,
      status: statuses[Math.floor(Math.random() * statuses.length)] as ThreatEvent['status'],
    };
  });
};

export const generateMockSystemMetrics = (): SystemMetrics => ({
  cpuUsage: Math.random() * 100,
  memoryUsage: Math.random() * 100,
  networkTraffic: Math.random() * 1000,
  activeConnections: Math.floor(Math.random() * 1000),
});

export const generateMockAnomalyScores = (): AnomalyScore[] => {
  return Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    score: Math.random(),
  }));
};