import React from 'react';
import { BookOpen, Code, Layers, Lightbulb, Copy } from 'lucide-react';
import { CodeAnalysis } from '../types';

interface ExplanationViewProps {
  analysis: CodeAnalysis;
}

export default function ExplanationView({ analysis }: ExplanationViewProps) {
  const [copiedExample, setCopiedExample] = React.useState<string | null>(null);

  const examples = [
    {
      title: "Hello World",
      description: "The classic first program - displays a message",
      code: `print("Hello, World!")
print("Welcome to Python!")`
    },
    {
      title: "Variables & Math",
      description: "Store numbers and do calculations",
      code: `name = "Alice"
age = 25
next_year = age + 1
print("Hi", name)
print("Next year you'll be", next_year)`
    },
    {
      title: "Making Decisions",
      description: "Use if statements to make choices",
      code: `temperature = 75
if temperature > 70:
    print("It's warm outside!")
else:
    print("It's cool outside!")`
    },
    {
      title: "Counting with Loops",
      description: "Repeat actions multiple times",
      code: `for i in range(5):
    print("Count:", i)

fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print("I like", fruit)`
    },
    {
      title: "Simple Function",
      description: "Create reusable code blocks",
      code: `def greet(name):
    return "Hello, " + name + "!"

message = greet("Python")
print(message)`
    }
  ];

  const copyExample = (code: string, title: string) => {
    navigator.clipboard.writeText(code);
    setCopiedExample(title);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
          Code Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{analysis.imports.length}</div>
            <div className="text-sm text-gray-600">Imports</div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-emerald-600">{analysis.functions.length}</div>
            <div className="text-sm text-gray-600">Functions</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(analysis.variables).length}</div>
            <div className="text-sm text-gray-600">Variables</div>
          </div>
        </div>

        <div className="flex items-center mb-6">
          <span className="text-sm font-medium text-gray-700 mr-3">Complexity:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getComplexityColor(analysis.complexity)}`}>
            {analysis.complexity}
          </span>
        </div>
      </div>

      {analysis.imports.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Code className="w-5 h-5 mr-2 text-indigo-600" />
            Imports & Dependencies
          </h3>
          <div className="space-y-2">
            {analysis.imports.map((importStatement, index) => (
              <div key={index} className="bg-gray-50 rounded px-3 py-2 font-mono text-sm">
                {importStatement}
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.functions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Layers className="w-5 h-5 mr-2 text-emerald-600" />
            Functions Defined
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {analysis.functions.map((func, index) => (
              <div key={index} className="bg-emerald-50 rounded-lg px-3 py-2 text-emerald-800 font-mono text-sm">
                {func}()
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Step-by-Step Explanation (In Plain English)
        </h3>
        
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Reading tip:</strong> Each step below explains what happens line by line, like having a friendly teacher walk you through the code!
          </p>
        </div>
        
        <div className="space-y-3">
          {analysis.explanation.map((step, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-gray-700 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {Object.keys(analysis.variables).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Variables</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.variables).map(([name, value]) => (
              <div key={name} className="bg-purple-50 rounded-lg p-3">
                <div className="font-mono text-sm font-medium text-purple-800">{name}</div>
                <div className="font-mono text-sm text-gray-600 mt-1">{String(value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}