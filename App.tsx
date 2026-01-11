
import React, { useState, useEffect, useCallback } from 'react';
import CodeEditor from './components/CodeEditor';
import ReviewPanel from './components/ReviewPanel';
import { performCodeReview } from './services/geminiService';
import { ReviewResult, ReviewHistoryItem } from './types';

const App: React.FC = () => {
  const [code, setCode] = useState<string>(`def sum(a, b):
    return a + b

print(sum(2, '3'))`);
  const [language, setLanguage] = useState<string>('python');
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('codereview_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('codereview_history', JSON.stringify(history));
  }, [history]);

  const handleReview = useCallback(async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await performCodeReview(code, language);
      setReviewResult(result);
      
      const newItem: ReviewHistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        code,
        language,
        result
      };
      setHistory(prev => [newItem, ...prev].slice(0, 10)); // Keep last 10
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'analyse.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);

  const loadFromHistory = (item: ReviewHistoryItem) => {
    setCode(item.code);
    setLanguage(item.language);
    setReviewResult(item.result);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">CodeReview AI</h1>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Expert Code Auditor v1.0</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-xs text-slate-500 font-medium bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Propulsé par Gemini 3 Pro
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        
        {/* Left Side: Editor & History - Augmented flex from 4 to 6 */}
        <div className="flex-[6] flex flex-col space-y-4 h-full min-h-[500px]">
          <CodeEditor 
            code={code} 
            setCode={setCode} 
            language={language}
            setLanguage={setLanguage}
            onReview={handleReview}
            isLoading={isLoading}
          />
          
          {/* Recent History Horizontal Scroll */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-3 h-32 flex flex-col">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Historique Récent</h4>
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide flex-1">
              {history.length === 0 ? (
                <div className="flex items-center justify-center w-full text-xs text-slate-600 italic">Aucune revue récente</div>
              ) : (
                history.map(item => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="flex-shrink-0 w-40 p-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition-all text-left"
                  >
                    <div className="text-[10px] text-slate-500 mb-1">{new Date(item.timestamp).toLocaleTimeString()}</div>
                    <div className="text-xs font-mono truncate text-slate-300">
                      {item.code.substring(0, 30)}...
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[9px] px-1 bg-slate-700 rounded text-slate-400 uppercase">{item.language}</span>
                      <span className="text-[10px] font-bold text-blue-400">{item.result.score}/100</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Review Panel - Reduced flex from 6 to 4 */}
        <div className="flex-[4] h-full flex flex-col">
          {error && (
            <div className="mb-4 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-300 text-sm flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          <ReviewPanel result={reviewResult} isLoading={isLoading} />
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-2 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center">
        <span>© 2024 CodeReview AI Agent - Assistant Expert en Développement</span>
        <div className="flex space-x-4">
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="hover:text-blue-400">Documentation Billing</a>
          <span>Statut API: <span className="text-green-500">Connecté</span></span>
        </div>
      </footer>
    </div>
  );
};

export default App;
