
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { ICONS } from './constants';
import { listCourses, listAssignments, getSubmission } from './services/classroomService';
import { getFastInsight } from './services/geminiService';
import { Course, Assignment, Submission, Rubric } from './types';
import AICorrectionModal from './components/AICorrectionModal';
import GradeAssignmentView from './components/GradeAssignmentView';
import ConfigureAssignmentView from './components/ConfigureAssignmentView';
import ClassroomSelectionView from './components/ClassroomSelectionView';
import UploadedAssignmentsView from './components/UploadedAssignmentsView';
import RubricsView from './components/RubricsView';
import GoogleFormsView from './components/GoogleFormsView';
import ConnectionsView from './components/ConnectionsView';
import CreateAssignmentView from './components/CreateAssignmentView';
import IALabView from './components/IALabView';
import ChatBot from './components/ChatBot';
import AskKleoView from './components/AskKleoView';

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Per-assignment configurations
  const [assignmentRubrics, setAssignmentRubrics] = useState<Record<string, Rubric>>({});

  // Navigation State
  const [view, setView] = useState<'classroom_selection' | 'dashboard' | 'grading' | 'configure' | 'uploaded_assignments' | 'rubrics' | 'google_forms' | 'connections' | 'create_assignment' | 'ia_lab' | 'ask_kleo'>('connections');
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [previousView, setPreviousView] = useState<'dashboard' | 'grading' | 'uploaded_assignments' | 'classroom_selection' | 'connections'>('connections');

  // Modal & Overlay State
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [fastInsights, setFastInsights] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isConnected) {
      const init = async () => {
        setLoading(true);
        const fetchedCourses = await listCourses();
        setCourses(fetchedCourses);
        setLoading(false);
      };
      init();
    }
  }, [isConnected]);

  const handleConnect = () => {
    setIsConnected(true);
    setView('classroom_selection');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSelectedCourse(null);
    setAssignments([]);
    setView('connections');
  };

  const handleSelectCourse = async (course: Course) => {
    setLoading(true);
    setSelectedCourse(course);
    const fetchedAssignments = await listAssignments(course.id);
    setAssignments(fetchedAssignments);
    setView('dashboard');
    setLoading(false);
  };

  const fetchFastInsight = async (assignment: Assignment) => {
    if (fastInsights[assignment.id]) return;
    try {
      const insight = await getFastInsight(assignment.title, assignment.description || 'Tarefa técnica em administração');
      setFastInsights(prev => ({ ...prev, [assignment.id]: insight }));
    } catch (err) {
      console.error("Fast insight failed", err);
    }
  };

  const handleOpenGradingView = (assignment: Assignment) => {
    setCurrentAssignment(assignment);
    setView('grading');
  };

  const handleOpenConfigureView = (assignment: Assignment) => {
    setPreviousView(view === 'configure' ? (previousView as any) : (view as any));
    setCurrentAssignment(assignment);
    setView('configure');
  };

  const handleOpenCreateAssignment = () => {
    setPreviousView(view as any);
    setView('create_assignment');
  };

  const handleGradeWithAI = async (submission: Submission) => {
    setActiveSubmission(submission);
    setActiveAssignment(currentAssignment);
  };

  const handleSaveGrade = (grade: number, feedback: string) => {
    alert(`Nota ${grade} e feedback salvos com sucesso no Google Classroom!`);
    setActiveSubmission(null);
    setActiveAssignment(null);
  };

  const handleSaveConfig = (config: any) => {
    if (currentAssignment && config.selectedRubric) {
      setAssignmentRubrics(prev => ({ ...prev, [currentAssignment.id]: config.selectedRubric }));
    }
    alert('Configuração salva com sucesso!');
    setView(previousView as any);
  };

  const handleFinalCreateAssignment = (data: any) => {
    alert('Tarefa criada com sucesso no Google Classroom!');
    setView(previousView as any);
  };

  const handleNavigateToClassrooms = () => isConnected ? setView('classroom_selection') : setView('connections');
  const handleNavigateToUploadedAssignments = () => setView('uploaded_assignments');
  const handleNavigateToRubrics = () => setView('rubrics');
  const handleNavigateToGoogleForms = () => setView('google_forms');
  const handleNavigateToConnections = () => setView('connections');
  const handleNavigateToIALab = () => setView('ia_lab');
  const handleNavigateToAskKleo = () => setView('ask_kleo');

  const filteredAssignments = assignments.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        currentView={view}
        selectedCourseId={selectedCourse?.id} 
        onNavigateToClassrooms={handleNavigateToClassrooms}
        onNavigateToUploadedAssignments={handleNavigateToUploadedAssignments}
        onNavigateToRubrics={handleNavigateToRubrics}
        onNavigateToGoogleForms={handleNavigateToGoogleForms}
        onNavigateToConnections={handleNavigateToConnections}
        onNavigateToIALab={handleNavigateToIALab}
        onOpenChat={handleNavigateToAskKleo}
      />
      
      <main className="flex-1 ml-64 p-8">
        {!isConnected && view !== 'connections' && view !== 'ia_lab' && view !== 'ask_kleo' ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="p-6 bg-indigo-50 rounded-full">
              <ICONS.Classroom className="w-16 h-16 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Conexão Necessária</h2>
            <p className="text-gray-500 max-w-md">Para acessar suas turmas e tarefas do Google Classroom, você precisa primeiro autorizar a conexão.</p>
            <button 
              onClick={() => setView('connections')}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              Ir para Conexões
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
            <p className="text-indigo-600 font-medium font-bold">Sincronizando dados...</p>
          </div>
        ) : view === 'classroom_selection' ? (
          <ClassroomSelectionView courses={courses} onSelectCourse={handleSelectCourse} />
        ) : view === 'uploaded_assignments' ? (
          <UploadedAssignmentsView onCreateNew={handleOpenCreateAssignment} />
        ) : view === 'google_forms' ? (
          <GoogleFormsView onLinkNew={() => alert('Abrindo modal de vinculação...')} />
        ) : view === 'rubrics' ? (
          <RubricsView />
        ) : view === 'connections' ? (
          <ConnectionsView isConnected={isConnected} onConnect={handleConnect} onDisconnect={handleDisconnect} />
        ) : view === 'ia_lab' ? (
          <IALabView />
        ) : view === 'ask_kleo' ? (
          <AskKleoView />
        ) : view === 'create_assignment' ? (
          <CreateAssignmentView 
            courses={courses} 
            selectedCourse={selectedCourse} 
            onBack={() => setView(previousView as any)} 
            onCreate={handleFinalCreateAssignment} 
          />
        ) : view === 'dashboard' ? (
          <>
            <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                <span>Painel</span><span>/</span><span>Sala de aula do Google</span><span>/</span><span className="text-indigo-600">{selectedCourse?.name}</span>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <button onClick={() => setView('classroom_selection')} className="p-2.5 hover:bg-white rounded-full transition-all border border-gray-200 bg-gray-50/50 hover:shadow-sm">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                  </button>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{selectedCourse?.name}</h2>
                    <p className="text-gray-500 text-sm font-medium mt-1">{selectedCourse?.section || 'Turma em andamento'}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-white transition-all bg-gray-50 shadow-sm hover:shadow-md active:scale-95">
                  <ICONS.Classroom className="w-4 h-4 text-indigo-600" />Abrir no Classroom
                </button>
              </div>
            </header>

            <section className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 p-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 rounded-2xl">
                    <ICONS.Assignments className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Suas Tarefas</h3>
                    <p className="text-sm text-gray-500">Selecione uma atividade para iniciar a correção inteligente.</p>
                  </div>
                </div>
                <button onClick={handleOpenCreateAssignment} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
                  <span className="text-xl leading-none font-light">+</span>Criar tarefa
                </button>
              </div>

              <div className="space-y-4">
                {filteredAssignments.map((assignment) => (
                  <div key={assignment.id} className="group flex justify-between items-center p-7 bg-white border border-gray-100 rounded-[1.5rem] hover:border-indigo-300 hover:bg-indigo-50/20 transition-all shadow-sm hover:shadow-md cursor-pointer">
                    <div className="space-y-3 flex-1" onClick={() => handleOpenGradingView(assignment)}>
                      <h4 className="text-xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">{assignment.title}</h4>
                      <div className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          Pontos: <span className="text-emerald-600">{assignment.maxPoints}</span>
                        </div>
                        {fastInsights[assignment.id] ? (
                          <div className="flex items-center gap-2 text-indigo-600 bg-white px-4 py-1.5 rounded-full border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-left-2 duration-300">
                            <ICONS.Bolt className="w-3.5 h-3.5" />
                            <span className="italic normal-case font-medium">{fastInsights[assignment.id]}</span>
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => { e.stopPropagation(); fetchFastInsight(assignment); }}
                            className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors bg-white px-4 py-1.5 rounded-full border border-gray-100 hover:border-indigo-100 shadow-sm"
                          >
                            <ICONS.Bolt className="w-3.5 h-3.5" />
                            <span className="normal-case font-medium">Insight Rápido</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[240px]">
                      <button onClick={(e) => { e.stopPropagation(); handleOpenGradingView(assignment); }} className="flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all active:scale-95">
                        <ICONS.Robot className="w-4 h-4" />Corrigir agora
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleOpenConfigureView(assignment); }} className="flex items-center justify-center gap-2 py-2.5 px-6 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">
                        <ICONS.Settings className="w-4 h-4 text-gray-400" />Configurar critérios
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : view === 'grading' ? (
          <GradeAssignmentView 
            course={selectedCourse!} 
            assignment={currentAssignment!} 
            onBack={() => setView('dashboard')} 
            onGradeClick={handleGradeWithAI} 
            onConfigureClick={() => handleOpenConfigureView(currentAssignment!)}
            configuredRubric={currentAssignment ? assignmentRubrics[currentAssignment.id] : null}
          />
        ) : (
          <ConfigureAssignmentView course={selectedCourse!} assignment={currentAssignment!} onBack={() => setView(previousView as any)} onSave={handleSaveConfig} />
        )}
      </main>

      {activeSubmission && activeAssignment && (
        <AICorrectionModal 
          assignment={activeAssignment} 
          submission={activeSubmission} 
          onClose={() => { setActiveSubmission(null); setActiveAssignment(null); }} 
          onSave={handleSaveGrade} 
        />
      )}
    </div>
  );
};

export default App;
