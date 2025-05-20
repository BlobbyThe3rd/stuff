import { LoadPyodide, type PyodideInterface } from './types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize and load Pyodide
export const setupPyodide = async (retryCount = 0): Promise<PyodideInterface> => {
  try {
    // Clear any existing Pyodide data from indexedDB
    if (retryCount === 0) {
      try {
        const req = indexedDB.deleteDatabase('pyodide');
        await new Promise((resolve, reject) => {
          req.onsuccess = resolve;
          req.onerror = reject;
        });
      } catch (e) {
        console.warn('Failed to clear IndexedDB:', e);
      }
    }

    // Load Pyodide script
    if (!window.loadPyodide) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
      script.async = true;
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    // Wait for the loadPyodide function to become available
    while (!window.loadPyodide) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Load Pyodide instance with explicit memory configuration
    const loadPyodide = window.loadPyodide as LoadPyodide;
    const pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      stdout: console.log,
      stderr: console.error,
      fullStdLib: false // Only load essential standard library modules
    });

    // Test the Pyodide instance with a simple operation
    const testResult = pyodide.runPython('1 + 1');
    if (testResult !== 2) {
      throw new Error('Pyodide initialization test failed');
    }

    console.log('Pyodide loaded successfully');
    return pyodide;
  } catch (error) {
    console.error(`Error setting up Pyodide (attempt ${retryCount + 1}/${MAX_RETRIES}):`, error);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying Pyodide initialization in ${RETRY_DELAY/1000} seconds...`);
      await delay(RETRY_DELAY);
      return setupPyodide(retryCount + 1);
    }
    
    throw new Error(`Failed to initialize Pyodide after ${MAX_RETRIES} attempts`);
  }
};