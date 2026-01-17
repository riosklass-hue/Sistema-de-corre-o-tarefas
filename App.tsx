
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { ICONS } from './constants';
import { listCourses, listAssignments, getSubmission } from './services/classroomService';
import { getFastInsight } from './services/geminiService';
import { Course, Assignment, Submission } from './types';
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('UNGRADED');

  // Navigation State
  const [view, setView] = useState<'classroom_selection' | 'dashboard' | 'grading' | 'configure' | 'uploaded_assignments' | 'rubrics' | 'google_forms' | 'connections' | 'create_assignment' | 'ia_lab' | 'ask_kleo'>('classroom_selection');
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [previousView, setPreviousView] = useState<'dashboard' | 'grading' | 'uploaded_assignments' | 'classroom_selection'>('classroom_selection');

  // Modal & Overlay State
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [fastInsights, setFastInsights] = useState<Record<string, string>>({});

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const fetchedCourses = await listCourses();
      setCourses(fetchedCourses);
      setLoading(false);
    };
    init();
  }, []);

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
    alert('Configuração salva com sucesso!');
    setView(previousView as any);
  };

  const handleFinalCreateAssignment = (data: any) => {
    alert('Tarefa criada com sucesso no Google Classroom!');
    setView(previousView as any);
  };

  const handleNavigateToClassrooms = () => setView('classroom_selection');
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
        {loading && !['classroom_selection', 'rubrics', 'uploaded_assignments', 'google_forms', 'connections', 'create_assignment', 'ia_lab', 'ask_kleo'].includes(view) ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-blue-600 font-medium">Carregando dados...</p>
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
          <ConnectionsView />
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
            <header className="mb-8">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-4">
                <span>Painel</span><span>/</span><span>Sala de aula do Google</span><span>/</span><span className="text-gray-900">{selectedCourse?.name}.</span>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <button onClick={() => setView('classroom_selection')} className="p-2 hover:bg-white rounded-full transition-colors border border-gray-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCourse?.name}</h2>
                    <p className="text-gray-500 text-sm">{selectedCourse?.section || 'Sem descrição'}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-white transition-colors bg-gray-50/50">
                  <ICONS.Classroom className="w-4 h-4" />Abrir no Google Classroom
                </button>
              </div>
            </header>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <ICONS.Assignments className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Tarefas</h3>
                    <p className="text-sm text-gray-500">Clique em qualquer tarefa para avaliar com IA.</p>
                  </div>
                </div>
                <button onClick={handleOpenCreateAssignment} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                  <span className="text-lg leading-none">+</span>Criar nova tarefa
                </button>
              </div>

              <div className="space-y-4">
                {filteredAssignments.map((assignment) => (
                  <div key={assignment.id} className="group flex justify-between items-center p-6 border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/10 transition-all shadow-sm">
                    <div className="space-y-2 flex-1">
                      <h4 className="text-lg font-bold text-gray-800">{assignment.title}</h4>
                      <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          Pontos <span className="text-emerald-600">{assignment.maxPoints}</span>
                        </div>
                        {fastInsights[assignment.id] ? (
                          <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 animate-in fade-in zoom-in duration-300">
                            <ICONS.Bolt className="w-3 h-3" />
                            <span className="italic">{fastInsights[assignment.id]}</span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => fetchFastInsight(assignment)}
                            className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                          >
                            <ICONS.Bolt className="w-3 h-3" />
                            <span>Insight Rápido (Flash Lite)</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[220px]">
                      <button onClick={() => handleOpenGradingView(assignment)} className="flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">
                        <ICONS.Robot className="w-4 h-4" />Corrija com IA
                      </button>
                      <button onClick={() => handleOpenConfigureView(assignment)} className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors">
                        <ICONS.Settings className="w-4 h-4 text-gray-400" />Configurar avaliação
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : view === 'grading' ? (
          <GradeAssignmentView course={selectedCourse!} assignment={currentAssignment!} onBack={() => setView('dashboard')} onGradeClick={handleGradeWithAI} onConfigureClick={() => handleOpenConfigureView(currentAssignment!)} />
        ) : (
          <ConfigureAssignmentView course={selectedCourse!} assignment={currentAssignment!} onBack={() => setView(previousView as any)} onSave={handleSaveConfig} />
        )}
      </main>

      {activeSubmission && activeAssignment && (
        <AICorrectionModal assignment={activeAssignment} submission={activeSubmission} onClose={() => { setActiveSubmission(null); setActiveAssignment(null); }} onSave={handleSaveGrade} />
      )}

      {/* Keep the floating chat bot available or remove if the full page view replaces it */}
      {/* <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} /> */}
    </div>
  );
};

export default App;
