
import React, { useState } from 'react';
import { ICONS } from '../constants';
import GoogleClassroomConnection from './GoogleClassroomConnection';

interface ConnectionsViewProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ConnectionsView: React.FC<ConnectionsViewProps> = ({ isConnected, onConnect, onDisconnect }) => {
  const [activeTab, setActiveTab] = useState('google');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>Painel</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span className="text-gray-900">Conexões</span>
        </div>

        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Conexões e Integrações</h1>
          <p className="text-sm text-gray-500 font-medium">Gerencie suas pontes digitais entre o RIOS e suas ferramentas de ensino preferidas.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full max-w-xl shadow-inner border border-gray-200">
        <button 
          onClick={() => setActiveTab('google')}
          className={`flex-1 flex items-center justify-center gap-3 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'google' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <ICONS.Classroom className={`w-4 h-4 ${activeTab === 'google' ? 'text-white' : 'text-gray-400'}`} />
          Google Classroom
        </button>
        <button 
          onClick={() => setActiveTab('canvas')}
          className={`flex-1 flex items-center justify-center gap-3 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'canvas' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <ICONS.Assignments className={`w-4 h-4 ${activeTab === 'canvas' ? 'text-white' : 'text-gray-400'}`} />
          Canvas LMS
        </button>
        <button 
          disabled
          className="flex-1 py-3 text-sm font-bold rounded-xl text-gray-400 cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          Moodle
        </button>
      </div>

      <div className="mt-8">
        {activeTab === 'google' ? (
          <GoogleClassroomConnection 
            isConnected={isConnected} 
            onConnect={onConnect} 
            onDisconnect={onDisconnect} 
          />
        ) : (
          <div className="bg-white rounded-[2.5rem] p-20 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 border border-gray-100">
              <ICONS.ExternalLink className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Integração em Desenvolvimento</h3>
              <p className="text-gray-500 max-w-md mx-auto">Estamos trabalhando arduamente para trazer o suporte ao {activeTab === 'canvas' ? 'Canvas' : 'Moodle'} o mais rápido possível.</p>
            </div>
            <button className="px-8 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-white transition-all text-sm">
              Notifique-me quando estiver pronto
            </button>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-12 pt-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_Classroom_Logo.svg/1024px-Google_Classroom_Logo.svg.png" className="h-8 object-contain" alt="Classroom" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1024px-Google_2015_logo.svg.png" className="h-6 object-contain" alt="Google" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/1024px-GitHub_Invertocat_Logo.svg.png" className="h-8 object-contain" alt="GitHub" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_Drive_logo_%282014-2020%29.svg/1024px-Google_Drive_logo_%282014-2020%29.svg.png" className="h-8 object-contain" alt="Drive" />
      </div>
    </div>
  );
};

export default ConnectionsView;
