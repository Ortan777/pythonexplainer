import React from 'react';
import { FlowchartNode } from '../types';

interface FlowchartViewProps {
  nodes: FlowchartNode[];
}

export default function FlowchartView({ nodes }: FlowchartViewProps) {
  const getNodeStyles = (type: string) => {
    switch (type) {
      case 'start':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'end':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'decision':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800 transform rotate-45';
      case 'input':
        return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'output':
        return 'bg-purple-100 border-purple-400 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  const getNodeShape = (type: string) => {
    switch (type) {
      case 'start':
      case 'end':
        return 'rounded-full';
      case 'decision':
        return 'rounded-lg';
      default:
        return 'rounded-lg';
    }
  };

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">No flowchart data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Execution Flow</h3>
      
      <div className="overflow-x-auto">
        <div className="relative min-w-max" style={{ minHeight: '600px' }}>
          <svg 
            width="400" 
            height={Math.max(600, nodes.length * 100)}
            className="absolute inset-0"
          >
            {/* Draw connections */}
            {nodes.map((node, index) => {
              if (index < nodes.length - 1) {
                const nextNode = nodes[index + 1];
                return (
                  <line
                    key={`line-${node.id}`}
                    x1={node.x}
                    y1={node.y + 20}
                    x2={nextNode.x}
                    y2={nextNode.y - 20}
                    stroke="#6B7280"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                );
              }
              return null;
            })}
            
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#6B7280"
                />
              </marker>
            </defs>
          </svg>

          {/* Render nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute border-2 p-3 min-w-32 text-center text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-200 ${getNodeStyles(node.type)} ${getNodeShape(node.type)}`}
              style={{
                left: node.x - 64,
                top: node.y - 20,
                transform: node.type === 'decision' ? 'rotate(45deg)' : 'none',
                width: node.type === 'decision' ? '90px' : 'auto',
                height: node.type === 'decision' ? '90px' : 'auto',
              }}
            >
              <div 
                className={node.type === 'decision' ? 'transform -rotate-45' : ''}
                style={{ 
                  fontSize: node.type === 'decision' ? '11px' : '12px',
                  lineHeight: node.type === 'decision' ? '1.2' : '1.4'
                }}
              >
                {node.text.length > 20 ? `${node.text.substring(0, 20)}...` : node.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-400"></div>
          <span className="text-sm text-gray-600">Start</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-400"></div>
          <span className="text-sm text-gray-600">Process</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-yellow-100 border-2 border-yellow-400 transform rotate-45"></div>
          <span className="text-sm text-gray-600">Decision</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-purple-100 border-2 border-purple-400"></div>
          <span className="text-sm text-gray-600">Output</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-red-100 border-2 border-red-400"></div>
          <span className="text-sm text-gray-600">End</span>
        </div>
      </div>
    </div>
  );
}