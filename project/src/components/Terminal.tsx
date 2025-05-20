import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Send } from 'lucide-react';

interface TerminalProps {
  pyodide: any;
}

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
}

const Terminal: React.FC<TerminalProps> = ({ pyodide }) => {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to the Derisian Translator!\n' },
    { type: 'output', content: "Type '1' to translate English ➡️ Derisian\nType '2' to translate Derisian ➡️ English\nType 'q' to quit\n> " }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [waitingForInput, setWaitingForInput] = useState(true);
  const [inputType, setInputType] = useState<'choice' | 'text'>('choice');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when terminal is clicked
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    if (terminalRef.current) {
      terminalRef.current.addEventListener('click', handleClick);
    }

    return () => {
      if (terminalRef.current) {
        terminalRef.current.removeEventListener('click', handleClick);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentInput.trim()) return;
    
    // Add user input to history
    setHistory(prev => [...prev, { type: 'input', content: currentInput }]);
    setWaitingForInput(false);
    
    try {
      if (inputType === 'choice') {
        if (currentInput === '1') {
          setHistory(prev => [...prev, { 
            type: 'output', 
            content: "\nEnter English word or phrase:\n> " 
          }]);
          setInputType('text');
          setCurrentInput('');
          setWaitingForInput(true);
          return;
        } else if (currentInput === '2') {
          setHistory(prev => [...prev, { 
            type: 'output', 
            content: "\nEnter Derisian word or phrase:\n> " 
          }]);
          setInputType('text');
          setCurrentInput('');
          setWaitingForInput(true);
          return;
        } else if (currentInput.toLowerCase() === 'q') {
          setHistory(prev => [...prev, { 
            type: 'output', 
            content: "\nGoodbye! ✌️" 
          }]);
          // Reset state to start over
          setTimeout(() => {
            setHistory([
              { type: 'output', content: 'Welcome to the Derisian Translator!\n' },
              { type: 'output', content: "Type '1' to translate English ➡️ Derisian\nType '2' to translate Derisian ➡️ English\nType 'q' to quit\n> " }
            ]);
            setInputType('choice');
            setWaitingForInput(true);
          }, 2000);
          setCurrentInput('');
          return;
        } else {
          setHistory(prev => [...prev, { 
            type: 'output', 
            content: "\nInvalid option, try again." 
          }]);
        }
      } else if (inputType === 'text') {
        // Process translation
        const direction = history[history.length - 2]?.content.includes("English ➡️ Derisian") ? "to_derisian" : "to_english";
        
        // Execute the Python translation function
        const result = pyodide.runPython(`
          setup_mappings()
          translate("${currentInput.replace(/"/g, '\\"')}", "${direction}")
        `);
        
        const outputLabel = direction === "to_derisian" ? "Derisian" : "English";
        setHistory(prev => [...prev, { 
          type: 'output', 
          content: `\n${outputLabel}: ${result}` 
        }]);
      }
      
      // Reset to choice prompt
      setHistory(prev => [...prev, { 
        type: 'output', 
        content: "\nType '1' to translate English ➡️ Derisian\nType '2' to translate Derisian ➡️ English\nType 'q' to quit\n> " 
      }]);
      setInputType('choice');
      
    } catch (err) {
      console.error('Error in Python execution:', err);
      setHistory(prev => [...prev, { 
        type: 'error', 
        content: `Error: ${err instanceof Error ? err.message : String(err)}` 
      }]);
      
      // Reset to choice prompt after error
      setHistory(prev => [...prev, { 
        type: 'output', 
        content: "\nType '1' to translate English ➡️ Derisian\nType '2' to translate Derisian ➡️ English\nType 'q' to quit\n> " 
      }]);
      setInputType('choice');
    }
    
    setCurrentInput('');
    setWaitingForInput(true);
  };

  return (
    <div className="flex flex-col rounded-lg overflow-hidden shadow-2xl border border-gray-700 bg-gray-800 h-[70vh] md:h-[60vh]">
      {/* Terminal header */}
      <div className="bg-gray-900 py-2 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TerminalIcon size={18} className="text-cyan-500" />
          <span className="font-mono text-cyan-500">derisian-translator.py</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      {/* Terminal body */}
      <div 
        ref={terminalRef}
        className="flex-grow bg-gray-950 p-4 overflow-y-auto font-mono text-sm text-green-500"
      >
        {history.map((line, index) => (
          <div key={index} className={`whitespace-pre-wrap ${line.type === 'error' ? 'text-red-500' : line.type === 'input' ? 'text-cyan-400' : ''}`}>
            {line.type === 'input' ? `> ${line.content}` : line.content}
          </div>
        ))}
        
        {waitingForInput && (
          <form onSubmit={handleInputSubmit} className="flex items-center mt-1">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              className="flex-grow bg-transparent outline-none text-cyan-400"
              autoFocus
            />
          </form>
        )}
      </div>
      
      {/* Terminal input area */}
      <div className="bg-gray-900 p-2">
        <form onSubmit={handleInputSubmit} className="flex items-center">
          <span className="text-green-500 mr-2">$</span>
          <input
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            disabled={!waitingForInput}
            className="flex-grow bg-transparent border-none outline-none text-white font-mono"
            placeholder={waitingForInput ? "Type your command..." : "Processing..."}
          />
          <button 
            type="submit" 
            disabled={!waitingForInput || !currentInput.trim()} 
            className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <Send size={16} className="text-cyan-500" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Terminal;