
import React, { useState, useEffect, useCallback } from 'react';
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

  const runCorrection = useCallback(async () => {
    setError(null);
    setLoading(true);

    // Validação prévia da chave de API
    if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
      setError("Verifique se sua chave de API do Gemini está configurada corretamente nas variáveis de ambiente e se possui as permissões necessárias.");
      setLoading(false);
      return;
    }

    try {
      const res = await correctAssignment(assignment, submission, DEFAULT_RUBRIC);
      setResult(res);
      setManualGrade(res.score);
      setManualFeedback(res.pedagogicalFeedback);
    } catch (err: any) {
      console.error("AI Correction Error:", err);
      
      // Mensagem detalhada conforme solicitado
      let errorMsg = "Erro ao processar correção com IA. Verifique se sua chave de API do Gemini está configurada corretamente nas variáveis de ambiente e se possui as permissões necessárias.";
      
      if (err.message?.includes("429")) {
        errorMsg = "Limite de requisições atingido. Por favor, aguarde um momento ou verifique sua cota no Google Cloud Console.";
      } else if (err.message?.includes("403")) {
        errorMsg = "Acesso negado. Verifique se sua chave de API possui as permissões necessárias e se o faturamento está ativo.";
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [assignment, submission]);

  useEffect(() => {
    runCorrection();
  }, [runCorrection]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
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

        <main className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ICONS.Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                </div>
              </div>
              <p className="text-blue-600 font-bold animate-pulse">A IA está analisando a resposta pedagogicamente...</p>
              <p className="text-xs text-gray-400">Isso pode levar alguns segundos para processar a rubrica técnica.</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-8 rounded-2xl space-y-4 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-red-100 rounded-full text-red-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <h4 className="text-lg font-bold text-red-900">Falha na Comunicação com a IA</h4>
              </div>
              <p className="text-sm text-red-700 leading-relaxed max-w-lg mx-auto">
                {error}
              </p>
              <div className="flex flex-col items-center gap-4 pt-4">
                <button 
                  onClick={runCorrection}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-md active:scale-95"
                >
                  Tentar Novamente
                </button>
                <a 
                  href="https://ai.google.dev/gemini-api/docs/billing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-red-500 hover:text-red-700 underline font-medium"
                >
                  Verificar status de faturamento e cotas →
                </a>
              </div>
            </div>
          ) : (
            <>
              <section className="animate-in fade-in duration-500">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Resposta Original do Aluno</h4>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed text-sm italic shadow-inner">
                  "{submission.studentResponse}"
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-700">
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Feedback Pedagógico</h4>
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">Editável</span>
                  </div>
                  <textarea 
                    value={manualFeedback}
                    onChange={(e) => setManualFeedback(e.target.value)}
                    className="w-full h-64 bg-white border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow shadow-sm resize-none"
                    placeholder="Feedback para o aluno..."
                  />
                </section>

                <section className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Pontos de Melhoria</h4>
                    <div className="space-y-2">
                      {result?.improvementSuggestions.map((s, i) => (
                        <div key={i} className="flex gap-3 p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-xs text-gray-700 items-start">
                          <ICONS.Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-4 shadow-sm">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nota Sugerida (IA)</h4>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <input 
                          type="number" 
                          max={assignment.maxPoints}
                          min={0}
                          step={0.1}
                          value={manualGrade}
                          onChange={(e) => setManualGrade(Number(e.target.value))}
                          className="w-28 text-4xl font-black bg-white border-2 border-indigo-200 rounded-2xl p-3 text-center text-indigo-700 focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <div className="text-xl text-gray-400 font-black">/ {assignment.maxPoints}</div>
                    </div>
                    <div className="p-3 bg-white/60 rounded-xl">
                      <p className="text-[10px] text-indigo-900 font-bold uppercase tracking-widest mb-1 opacity-60">Justificativa Técnica</p>
                      <p className="text-xs text-indigo-800 leading-relaxed italic">
                        {result?.justification}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}
        </main>

        <footer className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end items-center gap-4">
          <p className="text-[10px] text-gray-400 font-medium mr-auto max-w-xs leading-tight">
            As notas e feedbacks são sugestões baseadas na rubrica. O professor mantém o controle total final.
          </p>
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-white rounded-xl transition-all border border-gray-200"
          >
            Descartar
          </button>
          <button 
            disabled={loading || !!error}
            onClick={() => onSave(manualGrade, manualFeedback)}
            className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
          >
            <ICONS.Check className="w-4 h-4" />
            Lançar Nota no Classroom
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AICorrectionModal;
