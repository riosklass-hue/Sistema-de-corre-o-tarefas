
import React from 'react';
import { ICONS } from '../constants';

interface SidebarProps {
  currentView: string;
  selectedCourseId?: string;
  onNavigateToClassrooms?: () => void;
  onNavigateToUploadedAssignments?: () => void;
  onNavigateToRubrics?: () => void;
  onNavigateToGoogleForms?: () => void;
  onNavigateToConnections?: () => void;
  onNavigateToIALab?: () => void;
  onOpenChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView,
  selectedCourseId, 
  onNavigateToClassrooms,
  onNavigateToUploadedAssignments,
  onNavigateToRubrics,
  onNavigateToGoogleForms,
  onNavigateToConnections,
  onNavigateToIALab,
  onOpenChat
}) => {
  const isActive = (view: string) => currentView === view;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <h1 className="text-xl font-bold text-blue-900 leading-tight">RIOS<br/><span className="text-gray-500 font-medium text-sm uppercase tracking-tighter">Correção</span></h1>
        </div>

        <nav className="space-y-1">
          <button 
            onClick={onOpenChat}
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-bold rounded-lg transition-all border ${
              isActive('ask_kleo') 
                ? 'text-indigo-700 bg-indigo-50 border-indigo-200 shadow-sm' 
                : 'text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <ICONS.Bot className={`w-5 h-5 ${isActive('ask_kleo') ? 'text-indigo-600' : 'text-gray-400'}`} />
            Peça ajuda a Kleo
          </button>

          <button 
            onClick={onNavigateToIALab}
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all border mt-2 ${
              isActive('ia_lab') 
                ? 'text-indigo-700 bg-indigo-50 border-indigo-200 shadow-sm' 
                : 'text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <ICONS.Sparkles className={`w-5 h-5 ${isActive('ia_lab') ? 'text-indigo-600' : 'text-gray-400'}`} />
            IA Lab (Gemini 3)
          </button>
          
          <div className="mt-8">
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Avaliação das salas de aula</p>
            <div className="space-y-1">
              <button 
                onClick={onNavigateToClassrooms}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-all ${
                  isActive('classroom_selection') || isActive('dashboard') || isActive('grading')
                    ? 'text-indigo-700 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ICONS.Classroom className={`w-5 h-5 ${isActive('classroom_selection') ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span>Sala de aula do Google</span>
                </div>
                <svg className={`w-4 h-4 transition-transform ${isActive('dashboard') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              
              {(isActive('dashboard') || isActive('grading')) && (
                <div className="pl-9 space-y-1 animate-in slide-in-from-top-1 duration-200">
                  <button className="block w-full text-left px-3 py-1.5 text-xs text-gray-500 hover:text-indigo-600">Gestão da qualidade</button>
                  <button className="block w-full text-left px-3 py-1.5 text-xs font-bold text-indigo-600 border-l-2 border-indigo-600 pl-2 bg-indigo-50/50">Técnico em Administra...</button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Classificação geral</p>
            <button 
              onClick={onNavigateToUploadedAssignments}
              className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-all ${
                isActive('uploaded_assignments') ? 'text-indigo-700 bg-indigo-50 font-bold' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ICONS.Assignments className={`w-5 h-5 ${isActive('uploaded_assignments') ? 'text-indigo-600' : 'text-gray-400'}`} />
              Tarefas enviadas
            </button>
            <button 
              onClick={onNavigateToGoogleForms}
              className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-all ${
                isActive('google_forms') ? 'text-indigo-700 bg-indigo-50 font-bold' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ICONS.Forms className={`w-5 h-5 ${isActive('google_forms') ? 'text-indigo-600' : 'text-gray-400'}`} />
              Formulários Google
            </button>
          </div>

          <div className="mt-6">
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Seu conteúdo</p>
            <button 
              onClick={onNavigateToRubrics}
              className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-all ${
                isActive('rubrics') ? 'text-indigo-700 bg-indigo-50 font-bold' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ICONS.Rubrics className={`w-5 h-5 ${isActive('rubrics') ? 'text-indigo-600' : 'text-gray-400'}`} />
              Rubricas
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ICONS.Settings className="w-5 h-5 text-gray-400" />
              Instruções personalizadas
            </button>
          </div>
        </nav>
      </div>

      <div className="mt-auto border-t border-gray-100 p-4">
        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mb-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Central de Ajuda
        </button>

        <button 
          onClick={onNavigateToConnections}
          className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-all mb-4 ${
            isActive('connections') ? 'text-indigo-700 bg-indigo-50 font-bold' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ICONS.Connections className={`w-5 h-5 ${isActive('connections') ? 'text-indigo-600' : 'text-gray-400'}`} />
          Conexões
        </button>
        
        <button className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all mb-6 shadow-md shadow-indigo-100 hover:shadow-indigo-200 active:scale-95">
          Faça o upgrade para Pro
        </button>

        <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-2xl border border-gray-100">
          <img src="https://picsum.photos/40/40" alt="Avatar" className="w-9 h-9 rounded-full border-2 border-white shadow-sm" />
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-gray-800 truncate">Cleiton</p>
            <p className="text-[10px] text-gray-500 truncate">riosklass@gmail.com</p>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/></svg>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
