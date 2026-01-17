
import React from 'react';
import { ICONS } from '../constants';

interface UploadedAssignmentsViewProps {
  onCreateNew: () => void;
}

const UploadedAssignmentsView: React.FC<UploadedAssignmentsViewProps> = ({ onCreateNew }) => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>Painel</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span className="text-gray-900">Tarefas enviadas</span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tarefas enviadas</h1>
            <p className="text-sm text-gray-500">Corrija os trabalhos dos alunos em arquivos PDF, Word ou PowerPoint com IA.</p>
          </div>
          <button 
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md"
          >
            <span className="text-lg leading-none">+</span>
            Criar nova tarefa
          </button>
        </div>
      </header>

      <div className="bg-white border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center py-24 px-8 shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
          <ICONS.FilePlus className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
        <p className="text-sm text-gray-500 mb-8 text-center max-w-sm">
          Comece configurando sua primeira tarefa.
        </p>
        <button 
          onClick={onCreateNew}
          className="px-6 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
        >
          Criar nova tarefa
        </button>
      </div>
    </div>
  );
};

export default UploadedAssignmentsView;
