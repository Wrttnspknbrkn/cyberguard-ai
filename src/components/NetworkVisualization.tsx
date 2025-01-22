import React, { useEffect, useRef, useState } from 'react';
import { ThreatEvent } from '../types';
import { Shield } from 'lucide-react';

interface Node {
  id: string;
  x: number;
  y: number;
  type: 'source' | 'destination' | 'server';
  status?: 'active' | 'mitigated' | 'investigating';
}

interface Link {
  source: string;
  target: string;
  status?: 'active' | 'mitigated' | 'investigating';
}

interface NetworkVisualizationProps {
  threats: ThreatEvent[];
}

const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({ threats }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight - 60; // Account for legend
    const centerX = width / 2;
    const centerY = height / 2;

    // Create central server node
    const serverNode: Node = {
      id: 'server',
      x: centerX,
      y: centerY,
      type: 'server'
    };

    // Create nodes and links from threats
    const newNodes: Node[] = [serverNode];
    const newLinks: Link[] = [];
    const processedIPs = new Set<string>();

    threats.forEach(threat => {
      if (!processedIPs.has(threat.source)) {
        processedIPs.add(threat.source);
        newNodes.push({
          id: threat.source,
          x: centerX + (Math.random() - 0.5) * width * 0.8,
          y: centerY + (Math.random() - 0.5) * height * 0.8,
          type: 'source',
          status: threat.status
        });
      }

      if (!processedIPs.has(threat.destination)) {
        processedIPs.add(threat.destination);
        newNodes.push({
          id: threat.destination,
          x: centerX + (Math.random() - 0.5) * width * 0.8,
          y: centerY + (Math.random() - 0.5) * height * 0.8,
          type: 'destination',
          status: threat.status
        });
      }

      newLinks.push({
        source: threat.source,
        target: threat.destination,
        status: threat.status
      });
    });

    setNodes(newNodes);
    setLinks(newLinks);
  }, [threats, containerRef.current?.clientWidth, containerRef.current?.clientHeight]);

  const getNodeColor = (node: Node) => {
    if (node.type === 'server') return '#60A5FA';
    if (!node.status) return '#9CA3AF';
    return {
      active: '#EF4444',
      investigating: '#F59E0B',
      mitigated: '#10B981'
    }[node.status];
  };

  const getLinkColor = (link: Link) => {
    if (!link.status) return '#4B5563';
    return {
      active: '#EF4444',
      investigating: '#F59E0B',
      mitigated: '#10B981'
    }[link.status];
  };

  const Legend = () => (
    <div className="absolute bottom-2 left-2 bg-gray-900/80 p-3 rounded-lg backdrop-blur-sm border border-gray-700">
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-400" />
          <span>Protected Server</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span>Normal Traffic</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Active Threat</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Investigating</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Mitigated</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>Data Flow</span>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg width="100%" height="100%" className="overflow-visible">
        {/* Links */}
        {links.map((link, i) => {
          const sourceNode = nodes.find(n => n.id === link.source);
          const targetNode = nodes.find(n => n.id === link.target);
          if (!sourceNode || !targetNode) return null;

          return (
            <g key={`link-${i}`}>
              <line
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={getLinkColor(link)}
                strokeWidth={2}
                strokeOpacity={0.6}
              />
              {/* Animated packet */}
              <circle
                r={3}
                fill={getLinkColor(link)}
                opacity={0.8}
              >
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  path={`M${sourceNode.x},${sourceNode.y} L${targetNode.x},${targetNode.y}`}
                />
              </circle>
            </g>
          );
        })}
        
        {/* Nodes */}
        {nodes.map(node => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.type === 'server' ? 12 : 8}
              fill={getNodeColor(node)}
              className="cursor-pointer hover:filter hover:brightness-110"
            />
            {node.type === 'server' && (
              <circle
                cx={node.x}
                cy={node.y}
                r={20}
                fill={getNodeColor(node)}
                opacity={0.2}
                className="animate-pulse"
              />
            )}
            <title>{node.id}</title>
          </g>
        ))}
      </svg>
      <Legend />
    </div>
  );
};

export default NetworkVisualization;