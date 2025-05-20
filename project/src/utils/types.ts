export interface PyodideInterface {
  runPython(code: string): any;
  runPythonAsync(code: string): Promise<any>;
  globals: any;
}

export type LoadPyodide = (config: {
  indexURL: string;
  stdin?: () => string;
  stdout?: (text: string) => void;
  stderr?: (text: string) => void;
}) => Promise<PyodideInterface>;

// Add Pyodide to the window type
declare global {
  interface Window {
    loadPyodide?: LoadPyodide;
  }
}