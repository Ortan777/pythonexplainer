export interface CodeAnalysis {
  explanation: string[];
  flowchart: FlowchartNode[];
  animation: AnimationStep[];
  variables: Record<string, any>;
  functions: string[];
  imports: string[];
  complexity: 'low' | 'medium' | 'high';
}

export interface FlowchartNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'input' | 'output';
  text: string;
  x: number;
  y: number;
  connections: string[];
}

export interface AnimationStep {
  id: string;
  lineNumber: number;
  description: string;
  variables: Record<string, any>;
  highlight: boolean;
  output?: string;
}

export type ViewMode = 'explanation' | 'flowchart' | 'animation';
export type ExecutionState = 'idle' | 'playing' | 'paused' | 'completed';