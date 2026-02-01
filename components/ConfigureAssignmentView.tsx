
import React, { useState, useRef, useEffect } from 'react';
import { Assignment, Course, Rubric } from '../types';
import { ICONS } from '../constants';
import { generateRubric } from '../services/geminiService';

interface ConfigureAssignmentViewProps {
  course: Course;
  assignment: Assignment;
  onBack: () => void;
  onSave: (config: any) => void;
}

const ConfigureAssignmentView: React.FC<ConfigureAssignmentViewProps> = ({ course, assignment, onBack, onSave }) => {
  const [maxPoints, setMaxPoints] = useState(assignment.maxPoints.toString());
  const [feedbackLength, setFeedbackLength] = useState('standard');
  const [autoGrade, setAutoGrade] = useState(false);
  
  const [isRubricOpen, setIsRubricOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [generatingRubric, setGeneratingRubric] = useState(false);
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const rubricRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rubricRef.current && !rubricRef.current.contains(event.target as Node)) {
        setIsRubricOpen(false);
      }
      if (instructionsRef.current && !instructionsRef.current.contains(event.target as Node)) {
        setIsInstructionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenerateRubricWithAI = async () => {
    setGeneratingRubric(true);
    try {
      const rubric = await generateRubric(assignment.title, assignment.description || '');
      setSelectedRubric(rubric);
      setIsViewModalOpen(true);
    } catch (err) {
      alert('Falha ao gerar rubrica. Verifique sua conexão e chave de API.');
      console.error(err);
    } finally {
      setGeneratingRubric(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>Painel</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span>Sala de aula do Google</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span>{course.name}.</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span className="text-gray-900 truncate max-w-xs">Configurar: {assignment.title}</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 hover:bg-white rounded-full transition-colors border border-gray-200 bg-gray-50/50">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurar atribuição</h1>
            <p className="text-sm text-gray-500">{assignment.title}</p>
          </div>
        </div>
      </header>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-10">
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Configurações de avaliação</h3>
          <p className="text-sm text-gray-500">Defina como esta tarefa será avaliada. Certifique-se de que a pontuação total da rubrica selecionada esteja de acordo com a pontuação máxima.</p>
        </div>

        <div className="space-y-6 max-w-3xl">
          {/* Max Points */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800">Pontuação máxima</label>
            <p className="text-xs text-gray-500">A nota máxima que o RIOS CORREÇÃO atribuirá a esta tarefa será ajustada para a pontuação máxima do Google Classroom ao enviar as notas de volta.</p>
            <input 
              type="number"
              value={maxPoints}
              onChange={(e) => setMaxPoints(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
            />
            <p className="text-xs text-gray-400">Pontuação máxima do Google Classroom : {assignment.maxPoints}</p>
          </div>

          {/* Rubric Selection Dropdown */}
          <div className="space-y-2" ref={rubricRef}>
            <label className="text-sm font-bold text-gray-800">Rubrica de avaliação</label>
            <p className="text-xs text-gray-500">A rubrica que o RIOS CORREÇÃO usará para avaliar esta tarefa.</p>
            <div className="relative">
              <button 
                onClick={() => setIsRubricOpen(!isRubricOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <span>{selectedRubric ? selectedRubric.name : 'Clique para criar ou selecionar'}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isRubricOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              
              {isRubricOpen && (
                <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-gray-50">
                    <div className="relative">
                      <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="text" 
                        placeholder="Rubricas de pesquisa..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="p-1">
                    <button 
                      onClick={handleGenerateRubricWithAI}
                      disabled={generatingRubric}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {generatingRubric ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-700 border-t-transparent" /> : <ICONS.Magic className="w-5 h-5" />}
                      Gerar Rubrica Personalizada com IA
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      Rubrica de Importação
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors">
                Gerenciar Rubricas
              </button>
              {selectedRubric && (
                <button 
                  onClick={() => setIsViewModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ICONS.Eye className="w-3.5 h-3.5" />
                  Visualizar Rubrica
                </button>
              )}
              <button 
                onClick={handleGenerateRubricWithAI}
                disabled={generatingRubric}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50"
              >
                {generatingRubric ? <div className="animate-spin rounded-full h-3 w-3 border-2 border-indigo-700 border-t-transparent" /> : <ICONS.Sparkles className="w-3.5 h-3.5" />}
                Gerar Rubrica com IA
              </button>
            </div>
          </div>

          {/* Custom Instructions Dropdown */}
          <div className="space-y-2" ref={instructionsRef}>
            <label className="text-sm font-bold text-gray-800">Instruções personalizadas (opcional)</label>
            <p className="text-xs text-gray-500">Especifique instruções ou contexto adicionais para a ferramenta RIOS CORREÇÃO ao avaliar esta tarefa.</p>
            <div className="relative">
              <button 
                onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <span>Clique para criar ou selecionar</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isInstructionsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
            </div>
          </div>

          {/* Feedback Length */}
          <div className="space-y-3 pt-2">
            <label className="text-sm font-bold text-gray-800">Comprimento do feedback</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="feedbackLength" 
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  checked={feedbackLength === 'concise'}
                  onChange={() => setFeedbackLength('concise')}
                />
                <span className="text-sm text-gray-700">Feedback conciso e direto ao ponto.</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="feedbackLength" 
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  checked={feedbackLength === 'standard'}
                  onChange={() => setFeedbackLength('standard')}
                />
                <span className="text-sm text-gray-700 font-bold">Padrão - Feedback detalhado padrão</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 flex justify-start">
          <button 
            onClick={() => onSave({ maxPoints, feedbackLength, autoGrade, selectedRubric })}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            Salvar configuração
          </button>
        </div>
      </section>

      {/* Rubric View Modal */}
      {isViewModalOpen && selectedRubric && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500">
            <header className="px-10 py-8 border-b border-gray-100 flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  {course.name} - {assignment.title}
                </h2>
                <p className="text-sm text-gray-500 font-medium">{selectedRubric.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  Print Rubric
                </button>
                <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-auto custom-scrollbar p-10">
              <div className="border border-gray-100 rounded-[1.5rem] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 border-r border-gray-100 min-w-[200px]">Criteria</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 border-r border-gray-100">Excelente <span className="text-indigo-600 ml-1">(2 PTS)</span></th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 border-r border-gray-100">Bom <span className="text-indigo-600 ml-1">(1.5 PTS)</span></th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 border-r border-gray-100">Regular <span className="text-indigo-600 ml-1">(1 PT)</span></th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Insuficiente <span className="text-indigo-600 ml-1">(0.5 PTS)</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedRubric.criteria.map((criterion) => (
                      <tr key={criterion.id} className="hover:bg-indigo-50/10 transition-colors">
                        <td className="px-6 py-8 border-r border-gray-100 align-top">
                          <p className="text-sm font-bold text-gray-900 leading-tight mb-2">{criterion.title}</p>
                          <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{criterion.description}</p>
                        </td>
                        {criterion.levels.map((level, idx) => (
                          <td key={idx} className="px-6 py-8 border-r border-gray-100 align-top group">
                            <p className="text-xs text-gray-600 leading-relaxed font-medium transition-colors group-hover:text-gray-900">
                              {level.description}
                            </p>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>

            <footer className="px-10 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="px-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-white hover:border-indigo-600 transition-all shadow-sm active:scale-95"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigureAssignmentView;
