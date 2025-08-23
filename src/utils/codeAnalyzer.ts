import { CodeAnalysis, FlowchartNode, AnimationStep } from '../types';

export function isPythonCode(code: string): boolean {
  if (!code.trim()) return false;
  
  const pythonPatterns = [
    /^\s*def\s+\w+\s*\(/m,
    /^\s*class\s+\w+/m,
    /^\s*if\s+.*:/m,
    /^\s*for\s+\w+\s+in\s+.*:/m,
    /^\s*while\s+.*:/m,
    /^\s*try\s*:/m,
    /^\s*import\s+\w+/m,
    /^\s*from\s+\w+\s+import/m,
    /print\s*\(/,
    /^\s*#/m,
    /:\s*$/m,
  ];

  const nonPythonPatterns = [
    /\bvar\s+\w+\s*=/,
    /\blet\s+\w+\s*=/,
    /\bconst\s+\w+\s*=/,
    /function\s+\w+\s*\(/,
    /\bpublic\s+(class|static)/,
    /\bprivate\s+(class|static)/,
    /#include\s*</,
    /\bint\s+main\s*\(/,
    /\{[\s\S]*\}/,
    /;\s*$/m,
  ];

  for (const pattern of nonPythonPatterns) {
    if (pattern.test(code)) return false;
  }

  for (const pattern of pythonPatterns) {
    if (pattern.test(code)) return true;
  }

  const lines = code.split('\n').filter(line => line.trim());
  const hasIndentation = lines.some(line => /^\s{4,}/.test(line) || /^\s*\t/.test(line));
  
  return hasIndentation && lines.length > 1;
}

export function analyzeCode(code: string): CodeAnalysis {
  const lines = code.split('\n');
  const explanation: string[] = [];
  const flowchart: FlowchartNode[] = [];
  const animation: AnimationStep[] = [];
  const variables: Record<string, any> = {};
  const functions: string[] = [];
  const imports: string[] = [];

  let nodeId = 1;
  let yPosition = 100;
  let currentVariables: Record<string, any> = {};

  flowchart.push({
    id: 'start',
    type: 'start',
    text: 'Start',
    x: 200,
    y: yPosition,
    connections: []
  });

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) return;

    if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('from ')) {
      imports.push(trimmedLine);
      if (trimmedLine.startsWith('import ')) {
        const moduleName = trimmedLine.replace('import ', '').trim();
        explanation.push(`Line ${index + 1}: This brings in a tool called '${moduleName}' that we can use in our program. Think of it like borrowing a calculator - we're borrowing pre-made code to help us.`);
      } else {
        const parts = trimmedLine.match(/from\s+(\w+)\s+import\s+(.+)/);
        if (parts) {
          explanation.push(`Line ${index + 1}: This takes specific tools (${parts[2]}) from a toolbox called '${parts[1]}'. It's like taking just a hammer from a full toolbox instead of carrying the whole thing.`);
        } else {
          explanation.push(`Line ${index + 1}: This brings in tools from another program that we can use in our code.`);
        }
      }
      
      yPosition += 80;
      flowchart.push({
        id: `node_${nodeId++}`,
        type: 'process',
        text: `Import: ${trimmedLine}`,
        x: 200,
        y: yPosition,
        connections: []
      });

      animation.push({
        id: `step_${index}`,
        lineNumber: index + 1,
        description: `Importing: ${trimmedLine}`,
        variables: { ...currentVariables },
        highlight: true
      });
    }
    else if (trimmedLine.startsWith('def ')) {
      const funcMatch = trimmedLine.match(/def\s+(\w+)\s*\(/);
      if (funcMatch) {
        functions.push(funcMatch[1]);
        explanation.push(`Line ${index + 1}: This creates a new function (like a recipe) called '${funcMatch[1]}'. We can use this recipe later by calling its name. Functions help us avoid writing the same code over and over.`);
        
        yPosition += 80;
        flowchart.push({
          id: `node_${nodeId++}`,
          type: 'process',
          text: `Function: ${funcMatch[1]}`,
          x: 200,
          y: yPosition,
          connections: []
        });
      }
    }
    else if (trimmedLine.includes('=') && !trimmedLine.includes('==')) {
      const varMatch = trimmedLine.match(/(\w+)\s*=\s*(.+)/);
      if (varMatch) {
        const varName = varMatch[1];
        const varValue = varMatch[2];
        variables[varName] = varValue;
        currentVariables[varName] = varValue;
        
        explanation.push(`Line ${index + 1}: This creates a container called '${varName}' and puts the value ${varValue} inside it. Think of variables like labeled boxes where we store information to use later.`);
        
        yPosition += 80;
        flowchart.push({
          id: `node_${nodeId++}`,
          type: 'process',
          text: `${varName} = ${varValue}`,
          x: 200,
          y: yPosition,
          connections: []
        });

        animation.push({
          id: `step_${index}`,
          lineNumber: index + 1,
          description: `Assigning ${varValue} to ${varName}`,
          variables: { ...currentVariables },
          highlight: true
        });
      }
    }
    else if (trimmedLine.startsWith('if ')) {
      const condition = trimmedLine.replace('if ', '').replace(':', '');
      explanation.push(`Line ${index + 1}: This asks a yes/no question: "${condition}". If the answer is yes (true), the computer will do the next indented lines. If no (false), it skips them. It's like a fork in the road.`);
      
      yPosition += 80;
      flowchart.push({
        id: `node_${nodeId++}`,
        type: 'decision',
        text: condition,
        x: 200,
        y: yPosition,
        connections: []
      });

      animation.push({
        id: `step_${index}`,
        lineNumber: index + 1,
        description: `Evaluating condition: ${condition}`,
        variables: { ...currentVariables },
        highlight: true
      });
    }
    else if (trimmedLine.startsWith('for ') || trimmedLine.startsWith('while ')) {
      const loopType = trimmedLine.startsWith('for') ? 'for' : 'while';
      if (loopType === 'for') {
        const forMatch = trimmedLine.match(/for\s+(\w+)\s+in\s+(.+):/);
        if (forMatch) {
          explanation.push(`Line ${index + 1}: This starts a ${loopType} loop that will repeat the indented code below. It takes each item from ${forMatch[2]} one by one and calls it '${forMatch[1]}'. It's like going through a list and doing something with each item.`);
        } else {
          explanation.push(`Line ${index + 1}: This starts a ${loopType} loop that will repeat the indented code below multiple times.`);
        }
      } else {
        explanation.push(`Line ${index + 1}: This starts a ${loopType} loop that keeps repeating the indented code below as long as a condition stays true. It's like saying "keep doing this until I say stop".`);
      }
      
      yPosition += 80;
      flowchart.push({
        id: `node_${nodeId++}`,
        type: 'process',
        text: `${loopType.toUpperCase()} Loop`,
        x: 200,
        y: yPosition,
        connections: []
      });

      animation.push({
        id: `step_${index}`,
        lineNumber: index + 1,
        description: `Starting ${loopType} loop`,
        variables: { ...currentVariables },
        highlight: true
      });
    }
    else if (trimmedLine.includes('print(')) {
      const printMatch = trimmedLine.match(/print\s*\(\s*(.+)\s*\)/);
      if (printMatch) {
        explanation.push(`Line ${index + 1}: This displays ${printMatch[1]} on the screen. It's like the computer talking to us - showing us information or results.`);
        
        yPosition += 80;
        flowchart.push({
          id: `node_${nodeId++}`,
          type: 'output',
          text: `Print: ${printMatch[1]}`,
          x: 200,
          y: yPosition,
          connections: []
        });

        animation.push({
          id: `step_${index}`,
          lineNumber: index + 1,
          description: `Printing: ${printMatch[1]}`,
          variables: { ...currentVariables },
          highlight: true,
          output: printMatch[1].replace(/['"]/g, '')
        });
      }
    }
    else {
      if (trimmedLine.includes('return')) {
        explanation.push(`Line ${index + 1}: This sends a result back from a function. It's like a function giving us an answer after we asked it to do something.`);
      } else if (trimmedLine.includes('input(')) {
        explanation.push(`Line ${index + 1}: This asks the user to type something. The program waits for the user to enter text and press Enter.`);
      } else if (trimmedLine.includes('len(')) {
        explanation.push(`Line ${index + 1}: This counts how many items are in something (like counting letters in a word or items in a list).`);
      } else if (trimmedLine.includes('append(')) {
        explanation.push(`Line ${index + 1}: This adds a new item to the end of a list, like adding a new item to your shopping list.`);
      } else if (trimmedLine.includes('+=')) {
        explanation.push(`Line ${index + 1}: This adds to an existing value. It's a shortcut for saying "take what's already there and add more to it".`);
      } else if (trimmedLine.includes('==')) {
        explanation.push(`Line ${index + 1}: This compares two things to see if they're exactly the same. It asks "are these equal?"`)
      } else {
        explanation.push(`Line ${index + 1}: This line does: ${trimmedLine}. The computer follows this instruction step by step.`);
      }
      
      yPosition += 80;
      flowchart.push({
        id: `node_${nodeId++}`,
        type: 'process',
        text: trimmedLine.length > 30 ? trimmedLine.substring(0, 30) + '...' : trimmedLine,
        x: 200,
        y: yPosition,
        connections: []
      });

      animation.push({
        id: `step_${index}`,
        lineNumber: index + 1,
        description: `Executing: ${trimmedLine}`,
        variables: { ...currentVariables },
        highlight: true
      });
    }
  });

  yPosition += 80;
  flowchart.push({
    id: 'end',
    type: 'end',
    text: 'End',
    x: 200,
    y: yPosition,
    connections: []
  });

  for (let i = 0; i < flowchart.length - 1; i++) {
    flowchart[i].connections.push(flowchart[i + 1].id);
  }

  const totalLines = lines.filter(line => line.trim() && !line.trim().startsWith('#')).length;
  let complexity: 'low' | 'medium' | 'high' = 'low';
  
  if (totalLines > 20 || functions.length > 3) complexity = 'high';
  else if (totalLines > 10 || functions.length > 1) complexity = 'medium';

  return {
    explanation,
    flowchart,
    animation,
    variables,
    functions,
    imports,
    complexity
  };
}