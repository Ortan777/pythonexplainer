import React from 'react';
import { AlertCircle } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  error: string | null;
}

export default function CodeEditor({ code, onChange, error }: CodeEditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Python Code Editor</h2>
        {error && (
          <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-md text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
      </div>
      
      <div className="relative">
        <textarea
          value={code}
          onChange={handleChange}
          placeholder="Paste your Python code here..."
          className={`w-full h-80 p-4 font-mono text-sm border-2 rounded-lg resize-none transition-colors duration-200 ${
            error 
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-200'
          } focus:outline-none focus:ring-2`}
          spellCheck={false}
        />
      </div>
      
      <div className="text-sm text-gray-600">
        <div className="space-y-2">
          <p>🔍 <strong>Tip:</strong> Make sure your code uses proper Python indentation (spaces, not tabs work best).</p>
        </div>
      </div>
    </div>
  );
}