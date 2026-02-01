
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
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <h1 className="text-xl font-bold text-indigo-900 leading-tight">RIOS<br/><span className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">Pedagógico</span></h1>
        </div>

        <nav className="space-y-1">
          <button 
            onClick={onOpenChat}
            className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold rounded-xl transition-all border ${
              isActive('ask_kleo') 
                ? 'text-indigo-700 bg-indigo-50 border-indigo-200 shadow-sm' 
                : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <ICONS.Bot className={`w-5 h-5 ${isActive('ask_kleo') ? 'text-indigo-600' : 'text-gray-400'}`} />
            Assistente Kleo
          </button>

          <button 
            onClick={onNavigateToIALab}
            className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all border mt-2 ${
              isActive('ia_lab') 
                ? 'text-indigo-700 bg-indigo-50 border-indigo-200 shadow-sm' 
                : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <ICONS.Sparkles className={`w-5 h-5 ${isActive('ia_lab') ? 'text-indigo-600' : 'text-gray-400'}`} />
            IA Lab (Gemini 3)
          </button>
          
          <div className="mt-8">
            <p className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Salas de Aula</p>
            <div className="space-y-1">
              <button 
                onClick={onNavigateToClassrooms}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-all ${
                  isActive('classroom_selection') || isActive('dashboard') || isActive('grading')
                    ? 'text-indigo-700 font-bold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ICONS.Classroom className={`w-5 h-5 ${isActive('classroom_selection') ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span>Google Classroom</span>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6">
            <p className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Gestão em Lote</p>
            <button 
              onClick={onNavigateToUploadedAssignments}
              className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-all ${
                isActive('uploaded_assignments') ? 'text-indigo-700 bg-indigo-50 font-bold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ICONS.Assignments className={`w-5 h-5 ${isActive('uploaded_assignments') ? 'text-indigo-600' : 'text-gray-400'}`} />
              Tarefas Enviadas
            </button>
            <button 
              onClick={onNavigateToRubrics}
              className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-all ${
                isActive('rubrics') ? 'text-indigo-700 bg-indigo-50 font-bold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ICONS.Rubrics className={`w-5 h-5 ${isActive('rubrics') ? 'text-indigo-600' : 'text-gray-400'}`} />
              Rubricas
            </button>
          </div>
        </nav>
      </div>

      <div className="mt-auto border-t border-gray-100 p-4 space-y-4">
        {/* Status AI Ativado */}
        <div className="flex items-center gap-3 px-3 py-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-2">
          <div className="relative">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute inset-0"></div>
             <div className="w-2 h-2 bg-emerald-500 rounded-full relative"></div>
          </div>
          <div>
            <p className="text-[9px] font-black text-indigo-900 uppercase tracking-widest leading-none">Motor Gemini 3 Pro</p>
            <p className="text-[9px] text-emerald-600 font-bold">Ativado & Online</p>
          </div>
        </div>

        <button 
          onClick={onNavigateToConnections}
          className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-all ${
            isActive('connections') ? 'text-indigo-700 bg-indigo-50 font-bold' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ICONS.Connections className={`w-5 h-5 ${isActive('connections') ? 'text-indigo-600' : 'text-gray-400'}`} />
          Conexões
        </button>

        <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-2xl border border-gray-100">
          <img src="https://picsum.photos/40/40" alt="Avatar" className="w-8 h-8 rounded-full border border-white shadow-sm" />
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-bold text-gray-800 truncate">Administrador</p>
            <p className="text-[9px] text-gray-400 truncate font-medium">riosklass@gmail.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
