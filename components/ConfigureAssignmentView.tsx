
import React, { useState, useRef, useEffect } from 'react';
import { Assignment, Course } from '../types';
import { ICONS } from '../constants';

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
            <p className="text-xs text-gray-500">A nota máxima que o GradeWithAI atribuirá a esta tarefa será ajustada para a pontuação máxima do Google Classroom ao enviar as notas de volta.</p>
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
            <p className="text-xs text-gray-500">A rubrica que o GradeWithAI usará para avaliar esta tarefa.</p>
            <div className="relative">
              <button 
                onClick={() => setIsRubricOpen(!isRubricOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <span>Clique para criar ou selecionar</span>
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
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                      <ICONS.Magic className="w-5 h-5" />
                      Gerar Rubrica Personalizada
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      Rubrica de Importação
                    </button>
                  </div>

                  <div className="p-1 border-t border-gray-50">
                    <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Carregar Rubrica</p>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button key={i} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left">
                          <ICONS.Info className="w-4 h-4 text-gray-300 shrink-0" />
                          <span className="truncate">Técnico em Administração. - {i + 3}º Situa...</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors">
              Gerenciar Rubricas
            </button>
          </div>

          {/* Custom Instructions Dropdown */}
          <div className="space-y-2" ref={instructionsRef}>
            <label className="text-sm font-bold text-gray-800">Instruções personalizadas (opcional)</label>
            <p className="text-xs text-gray-500">Especifique instruções ou contexto adicionais para a ferramenta GradeWithAI ao avaliar esta tarefa.</p>
            <div className="relative">
              <button 
                onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <span>Clique para criar ou selecionar</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isInstructionsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              {isInstructionsOpen && (
                <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-gray-50">
                    <div className="relative">
                      <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="text" 
                        placeholder="Instruções de pesquisa..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="p-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                      Criar nova instrução
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                      <span>Sem instruções personalizadas</span>
                      <ICONS.Check className="w-4 h-4 text-indigo-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors">
              Gerenciar instruções personalizadas
            </button>
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
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="feedbackLength" 
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  checked={feedbackLength === 'long'}
                  onChange={() => setFeedbackLength('long')}
                />
                <span className="text-sm text-gray-700">Mais longo - Feedback mais detalhado e abrangente</span>
              </label>
            </div>
          </div>

          {/* Auto Grading */}
          <div className="space-y-3 pt-4">
            <label className="text-sm font-bold text-gray-800">Classificação automática</label>
            <p className="text-xs text-gray-500">Quando ativada, a função avalia as novas atividades e envia os resultados automaticamente de volta para o Google Classroom.</p>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="autoGrade"
                checked={autoGrade}
                onChange={(e) => setAutoGrade(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="autoGrade" className="text-sm text-gray-600">Ativar avaliação automática</label>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 italic">Esta tarefa não foi publicada através do GradeWithAI. Recrie-a ou reutilize-a através do GradeWithAI para ativar a correção e o envio automáticos.</p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 flex justify-start">
          <button 
            onClick={() => onSave({ maxPoints, feedbackLength, autoGrade })}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            Salvar configuração
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfigureAssignmentView;
