
import React from 'react';
import { ReviewResult, Severity, Category } from '../types';

interface ReviewPanelProps {
  result: ReviewResult | null;
  isLoading: boolean;
}

const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
  const colors = {
    [Severity.LOW]: 'bg-blue-900/30 text-blue-400 border-blue-800',
    [Severity.MEDIUM]: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    [Severity.HIGH]: 'bg-red-900/30 text-red-400 border-red-800',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${colors[severity]}`}>
      {severity}
    </span>
  );
};

const CategoryIcon: React.FC<{ category: Category }> = ({ category }) => {
  switch (category) {
    case Category.BUG: return <span>🐛</span>;
    case Category.SECURITY: return <span>🛡️</span>;
    case Category.PERFORMANCE: return <span>⚡</span>;
    case Category.READABILITY: return <span>📝</span>;
    default: return <span>💡</span>;
  }
};

const ReviewPanel: React.FC<ReviewPanelProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-semibold text-slate-200">Analyse du cerveau artificiel...</h3>
        <p className="text-slate-400 mt-2">Nous vérifions chaque ligne de votre code.</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-slate-500">Prêt pour la revue</h3>
        <p className="text-slate-600 mt-2">Collez votre code à gauche et cliquez sur le bouton pour obtenir des conseils d'expert.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto max-h-full pb-10">
      {/* Score and Summary Card */}
      <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Résumé de la Revue</h2>
          <div className="flex items-center space-x-2">
             <span className="text-xs text-slate-400 uppercase font-medium">Score Qualité:</span>
             <span className={`text-2xl font-black ${result.score > 80 ? 'text-green-400' : result.score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
               {result.score}/100
             </span>
          </div>
        </div>
        <p className="text-slate-300 leading-relaxed italic border-l-4 border-blue-500 pl-4">
          "{result.summary}"
        </p>
      </div>

      {/* Findings Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Observations Détaillées</h3>
        <div className="grid gap-4">
          {result.analysis.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-900/80 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CategoryIcon category={item.category as Category} />
                  <span className="font-semibold text-slate-100 capitalize">{item.category}</span>
                </div>
                <SeverityBadge severity={item.severity as Severity} />
              </div>
              <h4 className="text-blue-300 font-medium mb-1">{item.finding}</h4>
              <p className="text-sm text-slate-400 leading-snug">{item.reasoning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Recommandations & Corrections</h3>
        <div className="grid gap-6">
          {result.recommendations.map((rec, idx) => (
            <div key={idx} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 bg-slate-700/30">
                <h4 className="text-lg font-bold text-green-400">#{idx + 1}: {rec.title}</h4>
                <p className="text-sm text-slate-300 mt-1">{rec.description}</p>
              </div>
              {rec.fixedCode && (
                <div className="bg-black p-4 overflow-x-auto">
                  <pre className="code-font text-xs text-green-300">
                    <code>{rec.fixedCode}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewPanel;
