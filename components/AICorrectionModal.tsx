
import React, { useState, useEffect } from 'react';
import { Assignment, Submission, AIGradeResponse, Rubric } from '../types';
import { correctAssignment } from '../services/geminiService';
import { ICONS } from '../constants';

interface AICorrectionModalProps {
  assignment: Assignment;
  submission: Submission;
  onClose: () => void;
  onSave: (finalGrade: number, finalFeedback: string) => void;
}

const DEFAULT_RUBRIC: Rubric = {
  id: 'r1',
  name: 'Rubrica de Administração Técnica',
  criteria: [
    {
      id: 'c1',
      title: 'Domínio de Conceitos',
      description: 'Avalia o uso de termos técnicos administrativos.',
      levels: [
        { score: 10, title: 'Excelente', description: 'Usa termos técnicos com perfeição.' },
        { score: 7, title: 'Bom', description: 'Usa a maioria dos termos corretamente.' },
        { score: 4, title: 'Regular', description: 'Confunde alguns conceitos básicos.' },
        { score: 0, title: 'Insuficiente', description: 'Não demonstra conhecimento técnico.' },
      ]
    }
  ]
};

const AICorrectionModal: React.FC<AICorrectionModalProps> = ({ assignment, submission, onClose, onSave }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AIGradeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualGrade, setManualGrade] = useState<number>(0);
  const [manualFeedback, setManualFeedback] = useState<string>('');

  useEffect(() => {
    const runCorrection = async () => {
      try {
        setLoading(true);
        const res = await correctAssignment(assignment, submission, DEFAULT_RUBRIC);
        setResult(res);
        setManualGrade(res.score);
        setManualFeedback(res.pedagogicalFeedback);
      } catch (err) {
        setError("Erro ao processar correção com IA. Verifique sua chave API.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    runCorrection();
  }, [assignment, submission]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <header className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-50/30">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ICONS.Robot className="text-blue-600" />
              Corretor Inteligente (IA)
            </h3>
            <p className="text-sm text-gray-500">Avaliando resposta de: <span className="font-semibold">{submission.userName}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-blue-600 font-medium animate-pulse">A IA está analisando a resposta pedagogicamente...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
              <p className="font-semibold">Ocorreu um erro:</p>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Resposta Enviada</h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-700 leading-relaxed text-sm italic">
                  "{submission.studentResponse}"
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Feedback Pedagógico sugerido</h4>
                  <textarea 
                    value={manualFeedback}
                    onChange={(e) => setManualFeedback(e.target.value)}
                    className="w-full h-48 bg-white border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    placeholder="Feedback para o aluno..."
                  />
                </section>

                <section className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Sugestões de Melhoria</h4>
                    <ul className="space-y-2">
                      {result?.improvementSuggestions.map((s, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-600 items-start">
                          <span className="text-blue-500 mt-1">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Nota Sugerida pela IA</h4>
                    <div className="flex items-end gap-3">
                      <input 
                        type="number" 
                        max={assignment.maxPoints}
                        min={0}
                        step={0.1}
                        value={manualGrade}
                        onChange={(e) => setManualGrade(Number(e.target.value))}
                        className="w-24 text-3xl font-bold border-b-2 border-blue-500 bg-transparent text-center focus:outline-none"
                      />
                      <span className="text-xl text-gray-400 font-medium">/ {assignment.maxPoints}</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 font-medium italic">
                      Justificativa: {result?.justification}
                    </p>
                  </div>
                </section>
              </div>
            </>
          )}
        </main>

        <footer className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-white rounded-lg transition-colors border border-gray-200"
          >
            Cancelar
          </button>
          <button 
            disabled={loading || !!error}
            onClick={() => onSave(manualGrade, manualFeedback)}
            className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
          >
            Confirmar e Postar Nota
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AICorrectionModal;
