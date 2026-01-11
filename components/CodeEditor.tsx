
import React, { useRef, useState } from 'react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  onReview: () => void;
  isLoading: boolean;
}

const EXTENSION_MAP: Record<string, string> = {
  'py': 'python',
  'js': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'php': 'php',
  'java': 'java',
  'cpp': 'cpp',
  'h': 'cpp',
  'hpp': 'cpp',
  'go': 'go'
};

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  setCode, 
  language, 
  setLanguage, 
  onReview, 
  isLoading 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (EXTENSION_MAP[extension]) {
      setLanguage(EXTENSION_MAP[extension]);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setCode(content);
      }
    };
    reader.readAsText(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div 
      className={`flex flex-col h-full bg-slate-900 rounded-xl border transition-all overflow-hidden shadow-2xl ${
        isDragging ? 'border-blue-500 ring-2 ring-blue-500/20 scale-[1.01]' : 'border-slate-700'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-xs font-medium text-slate-400 uppercase tracking-widest">Éditeur</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onFileChange} 
            className="hidden" 
            accept=".py,.js,.ts,.tsx,.php,.java,.cpp,.go,.txt"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-blue-400 transition-colors flex items-center space-x-1"
            title="Importer un fichier"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-[10px] font-bold uppercase">Fichier</span>
          </button>

          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-700 text-xs text-slate-200 border-none rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="php">PHP</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 relative group">
        {isDragging && (
          <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px] z-10 flex items-center justify-center pointer-events-none">
            <div className="bg-slate-800 p-4 rounded-xl border border-blue-500 shadow-2xl flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400 mb-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-blue-400 font-bold uppercase text-xs tracking-tighter">Déposez votre fichier ici</span>
            </div>
          </div>
        )}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Collez votre code ici ou déposez un fichier..."
          className="w-full h-full p-6 bg-transparent code-font text-sm text-blue-100 outline-none resize-none placeholder-slate-600"
          spellCheck={false}
        />
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <button
          onClick={onReview}
          disabled={isLoading || !code.trim()}
          className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
            isLoading || !code.trim() 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyse en cours...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Lancer la Revue</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
