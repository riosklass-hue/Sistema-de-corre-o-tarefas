
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

const AI_THOUGHT_PHASES = [
  "Lendo submissão do aluno...",
  "Mapeando conceitos de Administração...",
  "Validando contra a Rubrica Pedagógica...",
  "Calculando pontuação proporcional...",
  "Gerando feedback personalizado...",
  "Finalizando diagnóstico técnico..."
];

const GradeAssignmentView: React.FC<GradeAssignmentViewProps> = ({ course, assignment, onBack, onGradeClick, onConfigureClick, configuredRubric }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Batch Processing State
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<Record<string, 'pending' | 'loading' | 'success' | 'error'>>({});
  const [batchResults, setBatchResults] = useState<Record<string, AIGradeResponse>>({});
  const [batchFinished, setBatchFinished] = useState(false);
  const [currentThought, setCurrentThought] = useState("");

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
      
      // Simulação visual de raciocínio para cada aluno
      for (const thought of AI_THOUGHT_PHASES) {
        setCurrentThought(`${student.name}: ${thought}`);
        await new Promise(r => setTimeout(r, 150));
      }

      try {
        const sub = await getSubmission(assignment.id, student.id);
        const result = await correctAssignment(assignment, sub, currentRubric);
        
        setBatchResults(prev => ({ ...prev, [student.id]: result }));
        setProcessingStatus(prev => ({ ...prev, [student.id]: 'success' }));
      } catch (err) {
        console.error(`Erro Aluno ${student.name}:`, err);
        setProcessingStatus(prev => ({ ...prev, [student.id]: 'error' }));
      }
      
      setBatchProgress(Math.round(((i + 1) / students.length) * 100));
    }

    setBatchFinished(true);
    setCurrentThought("Processamento concluído com sucesso.");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>Google Classroom</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span className="text-indigo-600">{course.name}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Avaliação em Massa</h1>
              <p className="text-xs text-gray-500 font-medium">{assignment.title}</p>
            </div>
          </div>

          <button 
            onClick={handleGradeAll}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping group-hover:block hidden"></div>
              <ICONS.Robot className="w-4 h-4" />
            </div>
            Corrigir Turma Inteira (Gemini 3 Pro)
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[650px]">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Lista de Alunos</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {students.map((student) => (
              <button 
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`flex items-center justify-between w-full px-4 py-3.5 rounded-2xl transition-all ${selectedStudentId === student.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${processingStatus[student.id] === 'success' ? (selectedStudentId === student.id ? 'bg-white' : 'bg-emerald-500') : processingStatus[student.id] === 'loading' ? 'bg-amber-400 animate-pulse' : 'bg-gray-200'}`}></div>
                  <span className="text-xs font-bold">{student.name}</span>
                </div>
                {batchResults[student.id] && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${selectedStudentId === student.id ? 'bg-white/20 border-white/30 text-white' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                    {batchResults[student.id].score}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-10 h-[650px] overflow-y-auto custom-scrollbar">
          {batchResults[selectedStudentId!] ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                      <ICONS.Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-gray-900">Parecer da IA</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Baseado na Rubrica: {currentRubric.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Nota Final</p>
                    <p className="text-4xl font-black text-indigo-600">{batchResults[selectedStudentId!].score}<span className="text-sm text-gray-300 ml-1">/{assignment.maxPoints}</span></p>
                  </div>
               </div>

               <div className="p-8 bg-indigo-50/30 rounded-3xl border border-indigo-100 relative">
                  <div className="absolute -top-3 left-8 px-4 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase">Feedback Pedagógico</div>
                  <p className="text-sm text-indigo-900 leading-relaxed italic font-medium">"{batchResults[selectedStudentId!].pedagogicalFeedback}"</p>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                    <h5 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-4">Pontos Positivos</h5>
                    <ul className="space-y-2">
                       <li className="text-xs text-emerald-700 flex gap-2"><ICONS.Check className="w-3 h-3 mt-0.5" /> Domínio técnico demonstrado</li>
                       <li className="text-xs text-emerald-700 flex gap-2"><ICONS.Check className="w-3 h-3 mt-0.5" /> Aplicação prática correta</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100">
                    <h5 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-4">Sugestões de Evolução</h5>
                    <ul className="space-y-2">
                      {batchResults[selectedStudentId!].improvementSuggestions.map((s,i) => (
                        <li key={i} className="text-xs text-amber-700 flex gap-2">
                          <ICONS.Bolt className="w-3 h-3 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
               </div>

               <div className="pt-8 border-t border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Original (Snapshot)</p>
                  <div className="p-6 bg-gray-50 rounded-2xl text-xs text-gray-500 leading-relaxed max-h-32 overflow-y-auto">
                    {submission?.studentResponse}
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 border-2 border-dashed border-gray-100">
                <ICONS.Robot className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-400">Pronto para a Inferência</h3>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">Selecione um aluno processado ou inicie a correção da turma completa.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isBatchProcessing && (
        <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden p-12 space-y-10 border border-white/20">
            <div className="flex justify-between items-start">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-indigo-600 text-[10px] font-black text-white rounded-full uppercase tracking-widest">Motor Pro Ativo</span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Gemini 3 inferindo dados...</h3>
               </div>
               <div className="p-6 bg-indigo-50 rounded-[2rem] text-indigo-600 animate-pulse">
                  <ICONS.Sparkles className="w-10 h-10" />
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Log de Pensamento</p>
                    <p className="text-sm font-bold text-gray-900 animate-in fade-in slide-in-from-left-2 duration-300">{currentThought}</p>
                  </div>
                  <span className="text-5xl font-black text-indigo-900">{batchProgress}%</span>
               </div>
               <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden p-1.5 border border-gray-200/50">
                  <div className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full transition-all duration-700 shadow-[0_0_20px_rgba(79,70,229,0.4)]" style={{ width: `${batchProgress}%` }}></div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-h-48 overflow-y-auto custom-scrollbar p-1">
               {students.map(s => (
                 <div key={s.id} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${processingStatus[s.id] === 'success' ? 'bg-emerald-50 border-emerald-100' : processingStatus[s.id] === 'loading' ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-transparent opactity-50'}`}>
                    <div className={`w-2 h-2 rounded-full ${processingStatus[s.id] === 'success' ? 'bg-emerald-500' : processingStatus[s.id] === 'loading' ? 'bg-indigo-600 animate-ping' : 'bg-gray-300'}`}></div>
                    <span className={`text-xs font-bold ${processingStatus[s.id] === 'success' ? 'text-emerald-900' : 'text-gray-500'}`}>{s.name}</span>
                 </div>
               ))}
            </div>

            {batchFinished && (
              <button 
                onClick={() => setIsBatchProcessing(false)}
                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Revisar Diagnóstico da Turma
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeAssignmentView;
