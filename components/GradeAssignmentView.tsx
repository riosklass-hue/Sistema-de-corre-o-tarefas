
import React, { useState, useEffect, useRef } from 'react';
import { Assignment, Course, Student, Submission, AIGradeResponse, Rubric } from '../types';
import { listStudents, getSubmission } from '../services/classroomService';
import { getFastInsight, getDetailedInsight, correctAssignment } from '../services/geminiService';
import { ICONS } from '../constants';

interface GradeAssignmentViewProps {
  course: Course;
  assignment: Assignment;
  onBack: () => void;
  onGradeClick: (submission: Submission) => void;
  onConfigureClick?: () => void;
  configuredRubric?: Rubric | null;
}

const DEFAULT_RUBRIC: Rubric = {
  id: 'default_r',
  name: 'Rubrica Padrão de Administração',
  criteria: [
    {
      id: 'c1',
      title: 'Domínio Técnico',
      description: 'Uso de terminologia e conceitos administrativos.',
      levels: [
        { score: 10, title: 'Excelente', description: 'Demonstra domínio total.' },
        { score: 7, title: 'Bom', description: 'Demonstra bom conhecimento.' },
        { score: 4, title: 'Regular', description: 'Apresenta falhas conceituais.' },
        { score: 0, title: 'Insuficiente', description: 'Não atende aos requisitos.' },
      ]
    }
  ]
};

const GradeAssignmentView: React.FC<GradeAssignmentViewProps> = ({ course, assignment, onBack, onGradeClick, onConfigureClick, configuredRubric }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [fastInsight, setFastInsight] = useState<string | null>(null);
  const [detailedInsight, setDetailedInsight] = useState<string | null>(null);
  const [isInsightExpanded, setIsInsightExpanded] = useState(false);
  const [insightLoading, setInsightLoading] = useState(false);
  const [detailedLoading, setDetailedLoading] = useState(false);

  // Batch Processing State
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<Record<string, 'pending' | 'loading' | 'success' | 'error'>>({});
  const [batchResults, setBatchResults] = useState<Record<string, AIGradeResponse>>({});
  const [batchFinished, setBatchFinished] = useState(false);

  const insightRef = useRef<HTMLDivElement>(null);
  const currentRubric = configuredRubric || DEFAULT_RUBRIC;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const fetchedStudents = await listStudents(course.id);
      setStudents(fetchedStudents);
      if (fetchedStudents.length > 0) {
        setSelectedStudentId(fetchedStudents[0].id);
      }
      setLoading(false);
    };
    fetch();
    
    const fetchInsight = async () => {
      setInsightLoading(true);
      try {
        const insight = await getFastInsight(assignment.title, assignment.description || 'Tarefa técnica');
        setFastInsight(insight);
      } catch (err) {
        console.error("Erro insight:", err);
      } finally {
        setInsightLoading(false);
      }
    };
    fetchInsight();
  }, [course, assignment]);

  useEffect(() => {
    if (selectedStudentId) {
      const fetchSubmission = async () => {
        const sub = await getSubmission(assignment.id, selectedStudentId);
        setSubmission(sub);
      };
      fetchSubmission();
    }
  }, [selectedStudentId, assignment]);

  const handleGradeAll = async () => {
    if (students.length === 0) return;
    
    setIsBatchProcessing(true);
    setBatchProgress(0);
    setBatchFinished(false);
    
    const initialStatus: any = {};
    students.forEach(s => initialStatus[s.id] = 'pending');
    setProcessingStatus(initialStatus);

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      setProcessingStatus(prev => ({ ...prev, [student.id]: 'loading' }));
      
      try {
        const sub = await getSubmission(assignment.id, student.id);
        // CHAMADA REAL À API GEMINI
        const result = await correctAssignment(assignment, sub, currentRubric);
        
        setBatchResults(prev => ({ ...prev, [student.id]: result }));
        setProcessingStatus(prev => ({ ...prev, [student.id]: 'success' }));
      } catch (err) {
        console.error(`Erro Aluno ${student.name}:`, err);
        setProcessingStatus(prev => ({ ...prev, [student.id]: 'error' }));
      }
      
      setBatchProgress(Math.round(((i + 1) / students.length) * 100));
      // Delay mínimo para suavidade visual e evitar picos excessivos
      await new Promise(r => setTimeout(r, 400));
    }

    setBatchFinished(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>Painel</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span>Google Classroom</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span>{course.name}</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span className="text-gray-900 truncate">Avaliação em Lote</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2.5 hover:bg-white rounded-full transition-all border border-gray-200">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Módulo de Correção</h1>
              <p className="text-sm text-gray-500">{assignment.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleGradeAll}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
            >
              <ICONS.Robot className="w-4 h-4" />
              Corrigir Turma Completa (Gemini API)
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Alunos Sincronizados</h3>
            <div className="mt-4 relative">
              <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Pesquisar..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {students.map((student) => (
              <button 
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl transition-all ${selectedStudentId === student.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50 border border-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${processingStatus[student.id] === 'success' ? 'bg-emerald-500' : processingStatus[student.id] === 'error' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-bold text-gray-700">{student.name}</span>
                </div>
                {batchResults[student.id] && (
                  <span className="text-[10px] font-black text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-100">
                    {batchResults[student.id].score}/{assignment.maxPoints}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-[600px]">
          {/* Exibição detalhada igual à anterior, mas agora mostrando resultados da IA se existirem */}
          <div className="flex justify-between items-start mb-8">
            <h3 className="text-xl font-bold text-gray-900">Visualização Pedagógica</h3>
            <div className="flex gap-2">
               <button onClick={onConfigureClick} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold">Configurar Rubrica</button>
               <button onClick={() => submission && onGradeClick(submission)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">Corrigir Individual</button>
            </div>
          </div>

          {batchResults[selectedStudentId!] ? (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <h4 className="text-sm font-bold text-emerald-900 mb-2">Feedback Gerado por IA</h4>
                  <p className="text-sm text-emerald-800 leading-relaxed italic">"{batchResults[selectedStudentId!].pedagogicalFeedback}"</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Sugestões</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {batchResults[selectedStudentId!].improvementSuggestions.map((s,i) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nota AI</p>
                    <p className="text-3xl font-black text-indigo-600">{batchResults[selectedStudentId!].score}</p>
                  </div>
               </div>
            </div>
          ) : (
            <div className="p-10 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center text-center space-y-4">
              <ICONS.Robot className="w-12 h-12 text-gray-200" />
              <p className="text-gray-400 text-sm italic">Aguardando processamento do Gemini...</p>
            </div>
          )}

          <div className="mt-10 pt-10 border-t border-gray-50">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Resposta Original do Aluno</p>
             <div className="p-6 bg-gray-50 rounded-2xl text-sm text-gray-700 leading-relaxed">
               {submission?.studentResponse}
             </div>
          </div>
        </div>
      </div>

      {isBatchProcessing && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden p-8 space-y-8">
            <div className="flex justify-between items-center">
               <div>
                  <h3 className="text-2xl font-bold text-gray-900">Gemini API Ativa</h3>
                  <p className="text-sm text-gray-500">Processando submissões com inteligência pedagógica...</p>
               </div>
               <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 animate-pulse border border-indigo-100 shadow-inner shadow-indigo-200">
                  <ICONS.Sparkles className="w-8 h-8" />
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Progresso da Turma</span>
                  <span className="text-4xl font-black text-indigo-900">{batchProgress}%</span>
               </div>
               <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden p-1 border border-gray-200">
                  <div className="h-full bg-indigo-600 rounded-full transition-all duration-500 shadow-sm" style={{ width: `${batchProgress}%` }}></div>
               </div>
            </div>

            <div className="max-h-40 overflow-y-auto custom-scrollbar border border-gray-50 rounded-2xl bg-gray-50/50 p-2">
               {students.map(s => (
                 <div key={s.id} className="flex justify-between p-3 rounded-lg hover:bg-white transition-colors">
                    <span className="text-xs font-medium text-gray-600">{s.name}</span>
                    <span className={`text-[10px] font-bold uppercase ${processingStatus[s.id] === 'success' ? 'text-emerald-600' : processingStatus[s.id] === 'loading' ? 'text-indigo-600' : 'text-gray-400'}`}>
                      {processingStatus[s.id] === 'loading' ? 'Analisando...' : processingStatus[s.id] === 'success' ? 'Concluído' : 'Aguardando'}
                    </span>
                 </div>
               ))}
            </div>

            {batchFinished && (
              <button 
                onClick={() => setIsBatchProcessing(false)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Revisar Resultados da IA
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeAssignmentView;
