import React, { useState, useEffect } from 'react';
import { AnimationStep, ExecutionState } from '../types';
import { Play, Pause, SkipForward, RotateCcw, Terminal } from 'lucide-react';

interface AnimationViewProps {
  steps: AnimationStep[];
  executionState: ExecutionState;
  onStateChange: (state: ExecutionState) => void;
}

export default function AnimationView({ steps, executionState, onStateChange }: AnimationViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [output, setOutput] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (executionState === 'playing' && currentStep < steps.length) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= steps.length) {
            onStateChange('completed');
            return prev;
          }
          
          const step = steps[next];
          if (step.output) {
            setOutput(prev => [...prev, step.output!]);
          }
          
          return next;
        });
      }, 1500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [executionState, currentStep, steps, onStateChange]);

  const handlePlay = () => {
    if (currentStep >= steps.length) {
      handleReset();
      return;
    }
    onStateChange(executionState === 'playing' ? 'paused' : 'playing');
  };

  const handleStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => {
        const next = prev + 1;
        const step = steps[next];
        if (step?.output) {
          setOutput(prev => [...prev, step.output!]);
        }
        if (next >= steps.length) {
          onStateChange('completed');
        }
        return next;
      });
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setOutput([]);
    onStateChange('idle');
  };

  if (steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">No animation data available</p>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Execution Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Execution Controls</h3>
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={handlePlay}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
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
                <span>{currentStep >= steps.length ? 'Restart' : 'Play'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleStep}
            disabled={currentStep >= steps.length}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <SkipForward className="w-4 h-4" />
            <span>Step</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step Display */}
      {currentStepData && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
              {currentStepData.lineNumber}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Current Step
              </h4>
              <p className="text-gray-700 mb-4">{currentStepData.description}</p>
              
              {Object.keys(currentStepData.variables).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">Variable States</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(currentStepData.variables).map(([name, value]) => (
                      <div key={name} className="bg-white rounded border px-3 py-2">
                        <div className="font-mono text-sm font-medium text-purple-700">{name}</div>
                        <div className="font-mono text-sm text-gray-600">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Output Console */}
      {output.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Terminal className="w-5 h-5 mr-2" />
            Program Output
          </h4>
          <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
            {output.map((line, index) => (
              <div key={index} className="mb-1">
                &gt; {line}
              </div>
            ))}
            {executionState === 'playing' && (
              <div className="animate-pulse">_</div>
            )}
          </div>
        </div>
      )}

      {/* All Steps Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Execution Timeline</h4>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                index === currentStep 
                  ? 'bg-blue-100 border-2 border-blue-300' 
                  : index < currentStep 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                index === currentStep 
                  ? 'bg-blue-600 text-white' 
                  : index < currentStep 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-400 text-white'
              }`}>
                {step.lineNumber}
              </div>
              <span className={`text-sm ${
                index === currentStep ? 'text-blue-800 font-medium' : 'text-gray-700'
              }`}>
                {step.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}