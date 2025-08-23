import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Download } from 'lucide-react';
import { ExecutionState, CodeAnalysis } from '../types';

interface ExecutionControlsProps {
  executionState: ExecutionState;
  onStateChange: (state: ExecutionState) => void;
  onExport: () => void;
  analysis: CodeAnalysis | null;
}

export default function ExecutionControls({ 
  executionState, 
  onStateChange, 
  onExport, 
  analysis 
}: ExecutionControlsProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onStateChange(executionState === 'playing' ? 'paused' : 'playing')}
          disabled={!analysis}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            executionState === 'playing'
              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {executionState === 'playing' ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Play</span>
            </>
          )}
        </button>

        <button
          onClick={() => onStateChange('idle')}
          disabled={!analysis}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      <button
        onClick={onExport}
        disabled={!analysis}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <Download className="w-4 h-4" />
        <span>Export Markdown</span>
      </button>
    </div>
  );
}