
import React, { useState } from 'react';
import { ICONS } from '../constants';

const MOCK_RUBRICS = [
  { id: '1', name: 'Técnico em Administração. - 5º Situação Geradora de Aprendizagem (SGA)', fileName: 'Rubrica gerada', date: '16 de janeiro de 2026' },
  { id: '2', name: 'Técnico em Administração. - 5º Situação Geradora de Aprendizagem (SGA)', fileName: 'Rubrica gerada', date: '10 de janeiro de 2026' },
  { id: '3', name: 'Técnico em Administração. - 4 situação geradora de aprendizagem', fileName: 'Rubrica gerada', date: '10 de janeiro de 2026' },
  { id: '4', name: 'Técnico em Administração. - 4 situação geradora de aprendizagem', fileName: 'Rubrica gerada', date: '10 de janeiro de 2026' },
  { id: '5', name: 'Técnico em Administração. - 5º Situação Geradora de Aprendizagem (SGA)', fileName: 'Rubrica gerada', date: '9 de janeiro de 2026' },
];

const RubricsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>Painel</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span className="text-gray-900">Rubrics</span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rubricas</h1>
            <p className="text-sm text-gray-500">Gerencie suas rubricas de avaliação para as tarefas.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <ICONS.Magic className="w-4 h-4" />
              Gerar Rubrica
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              Rubrica de Importação
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
              <ICONS.FilePlus className="w-4 h-4" />
              Carregar Rubrica
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex justify-between gap-4">
          <div className="relative flex-1 max-w-2xl">
            <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Rubricas de pesquisa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-600 outline-none cursor-pointer">
              <option>Todas as rubricas</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Nome</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Nome do arquivo</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Enviado</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[10px] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_RUBRICS.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).map((rubric) => (
                <tr key={rubric.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{rubric.name}</td>
                  <td className="px-6 py-4 text-gray-500">{rubric.fileName}</td>
                  <td className="px-6 py-4 text-gray-500">{rubric.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <ICONS.Trash className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                        <ICONS.Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RubricsView;
