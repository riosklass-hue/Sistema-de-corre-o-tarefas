
import React from 'react';
import { ICONS } from '../constants';

interface SidebarProps {
  selectedCourseId?: string;
  onNavigateToClassrooms?: () => void;
  onNavigateToUploadedAssignments?: () => void;
  onNavigateToRubrics?: () => void;
  onNavigateToGoogleForms?: () => void;
  onNavigateToConnections?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCourseId, 
  onNavigateToClassrooms,
  onNavigateToUploadedAssignments,
  onNavigateToRubrics,
  onNavigateToGoogleForms,
  onNavigateToConnections
}) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <h1 className="text-xl font-bold text-blue-900 leading-tight">Grade<br/><span className="text-gray-500 font-medium text-sm">WithAI</span></h1>
        </div>

        <nav className="space-y-1">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg transition-colors">
            <ICONS.Classroom className="w-5 h-5" />
            Peça ajuda a Kleo
          </button>
          
          <div className="mt-8">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Avaliação das salas de aula</p>
            <div className="space-y-1">
              <button 
                onClick={onNavigateToClassrooms}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ICONS.Classroom className="w-5 h-5 text-gray-400" />
                  <span>Sala de aula do Google</span>
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              
              <div className="pl-9 space-y-1">
                <button className="block w-full text-left px-3 py-1.5 text-sm text-gray-500 hover:text-blue-600">Gestão da qualidade</button>
                <button className="block w-full text-left px-3 py-1.5 text-sm font-medium text-blue-600 border-l-2 border-blue-600 pl-2 bg-blue-50/50">Técnico em Administra...</button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Classificação geral</p>
            <button 
              onClick={onNavigateToUploadedAssignments}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ICONS.Assignments className="w-5 h-5 text-gray-400" />
              Tarefas enviadas
            </button>
            <button 
              onClick={onNavigateToGoogleForms}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ICONS.Forms className="w-5 h-5 text-gray-400" />
              Formulários Google
            </button>
          </div>

          <div className="mt-6">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Seu conteúdo</p>
            <button 
              onClick={onNavigateToRubrics}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ICONS.Rubrics className="w-5 h-5 text-gray-400" />
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
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mb-4"
        >
          <ICONS.Connections className="w-5 h-5 text-gray-400" />
          Conexões
        </button>
        
        <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors mb-6 shadow-sm">
          Faça o upgrade para Pro
        </button>

        <div className="flex items-center gap-3 px-2 py-3 bg-gray-50 rounded-xl border border-gray-100">
          <img src="https://picsum.photos/40/40" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-gray-800 truncate">Cleiton</p>
            <p className="text-xs text-gray-500 truncate">riosklass@gmail.com</p>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/></svg>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
