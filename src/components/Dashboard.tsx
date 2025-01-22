import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Network } from 'lucide-react';
import { ThreatEvent, SystemMetrics, AnomalyScore } from '../types';
import { generateMockThreatEvents, generateMockSystemMetrics, generateMockAnomalyScores } from '../utils/mockData';
import NetworkVisualization from './NetworkVisualization';

const Dashboard: React.FC = () => {
  const [threats, setThreats] = useState<ThreatEvent[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>(generateMockSystemMetrics());
  const [anomalyScores, setAnomalyScores] = useState<AnomalyScore[]>([]);

  useEffect(() => {
    // Initial load
    setThreats(generateMockThreatEvents());
    setAnomalyScores(generateMockAnomalyScores());

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(generateMockSystemMetrics());
      if (Math.random() > 0.7) {
        setThreats(prev => [generateMockThreatEvents()[0], ...prev.slice(0, 9)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-xl font-bold">CyberGuard AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Activity className="w-4 h-4 text-green-400 mr-2" />
              System Status: Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="CPU Usage"
            value={`${metrics.cpuUsage.toFixed(1)}%`}
            trend="up"
          />
          <MetricCard
            title="Memory Usage"
            value={`${metrics.memoryUsage.toFixed(1)}%`}
            trend="stable"
          />
          <MetricCard
            title="Network Traffic"
            value={`${metrics.networkTraffic.toFixed(0)} Mb/s`}
            trend="up"
          />
          <MetricCard
            title="Active Connections"
            value={metrics.activeConnections.toString()}
            trend="down"
          />
        </div>

        {/* Threats Table */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-bold mb-4">Recent Threats</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="p-2">Timestamp</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Severity</th>
                  <th className="p-2">Source</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {threats.map((threat) => (
                  <tr key={threat.id} className="border-b border-gray-700">
                    <td className="p-2">{new Date(threat.timestamp).toLocaleTimeString()}</td>
                    <td className="p-2">
                      <span className="inline-flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1 text-yellow-400" />
                        {threat.type}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        {
                          low: 'bg-green-900 text-green-200',
                          medium: 'bg-yellow-900 text-yellow-200',
                          high: 'bg-orange-900 text-orange-200',
                          critical: 'bg-red-900 text-red-200',
                        }[threat.severity]
                      }`}>
                        {threat.severity}
                      </span>
                    </td>
                    <td className="p-2">{threat.source}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        {
                          active: 'bg-red-900 text-red-200',
                          investigating: 'bg-blue-900 text-blue-200',
                          mitigated: 'bg-green-900 text-green-200',
                        }[threat.status]
                      }`}>
                        {threat.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Network Activity Map */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Network Activity</h2>
          <div className="h-64 border border-gray-700 rounded">
            <NetworkVisualization threats={threats} />
          </div>
        </div>
      </main>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <div className="flex items-center mt-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`ml-2 ${
          trend === 'up' ? 'text-green-400' :
          trend === 'down' ? 'text-red-400' :
          'text-gray-400'
        }`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;