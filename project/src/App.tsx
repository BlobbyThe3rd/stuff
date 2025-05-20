import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './components/LoadingSpinner';
import Terminal from './components/Terminal';
import Header from './components/Header';
import { setupPyodide } from './utils/pyodide';
import { pythonCode } from './utils/translator-code';
import { Lock } from 'lucide-react';

function App() {
  const [pyodide, setPyodide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading Python environment...');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    const initPyodide = async () => {
      try {
        setLoadingText('Initializing Python runtime...');
        const pyodideInstance = await setupPyodide();
        
        setLoadingText('Loading translator script...');
        try {
          pyodideInstance.runPython(`
${pythonCode}
          `);
        } catch (pythonError) {
          console.error('Failed to load Python script:', pythonError);
          throw new Error('Failed to initialize translator script');
        }
        
        setPyodide(pyodideInstance);
      } catch (err) {
        console.error('Failed to initialize Pyodide:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to load Python environment: ${errorMessage}. Please try clearing your browser cache and reloading.`);
      } finally {
        setLoading(false);
      }
    };

    initPyodide();
  }, [retryCount]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'kzhhdliw') {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gray-700 p-3 rounded-full">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-6">Authentication Required</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Enter Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border ${passwordError ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="Enter password"
                  autoFocus
                />
                {passwordError && (
                  <p className="mt-2 text-sm text-red-400">Incorrect password. Please try again.</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors duration-200"
              >
                Access Translator
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-red-800 p-6 rounded-lg shadow-xl max-w-md">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleRetry} 
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
            >
              Retry Initialization
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <LoadingSpinner />
            <p className="text-lg">{loadingText}</p>
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            <Terminal pyodide={pyodide} />
          </div>
        )}
      </main>
      
      <footer className="p-4 text-center text-gray-500 text-sm">
        <p>Derisian Translator © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;