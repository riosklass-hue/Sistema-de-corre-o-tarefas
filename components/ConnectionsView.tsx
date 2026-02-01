
import React, { useState } from 'react';
import { ICONS } from '../constants';

const PERMISSIONS = [
  { text: "Veja os cursos que você está ministrando.", scope: "classroom.courses.readonly" },
  { text: "Veja os alunos que você está ensinando.", scope: "classroom.rosters.readonly" },
  { text: "Veja o tipo de trabalho enviado pelos alunos.", scope: "classroom.student-submissions.students.readonly" },
  { text: "Visualize os trabalhos dos alunos para corrigi-los.", scope: "drive.readonly" },
  { text: "Enviar notas de volta para o Google Classroom", scope: "classroom.coursework.students" },
  { text: "Envie seu feedback pelo Google Classroom.", scope: "drive.file" },
  { text: "Acesse as respostas do Formulário Google para avaliação.", scope: "forms.responses.readonly" },
];

interface ConnectionsViewProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ConnectionsView: React.FC<ConnectionsViewProps> = ({ isConnected, onConnect, onDisconnect }) => {
  const [activeTab, setActiveTab] = useState('google');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleStartConnection = () => {
    setIsConnecting(true);
    // Simula o delay do OAuth do Google
    setTimeout(() => {
      onConnect();
      setIsConnecting(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>Painel</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span className="text-gray-900">Conexões</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conexões e Integrações</h1>
          <p className="text-sm text-gray-500">Conecte sua conta do RIOS às ferramentas que você já usa.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-full max-w-2xl">
        <button 
          onClick={() => setActiveTab('google')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'google' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Google Classroom
        </button>
        <button 
          onClick={() => setActiveTab('tela')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'tela' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Canvas LMS
        </button>
        <button 
          disabled
          className="flex-1 py-2.5 text-sm font-bold rounded-lg text-gray-400 cursor-not-allowed italic"
        >
          Microsoft Teams
        </button>
      </div>

      {!isConnected ? (
        <section className="bg-white rounded-[2rem] shadow-xl shadow-indigo-50/50 border border-indigo-50 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 space-y-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <ICONS.Classroom className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Turbine sua produtividade com Google Classroom</h3>
                <p className="text-gray-500 leading-relaxed">Sincronize automaticamente seus alunos, tarefas e notas. Economize horas de trabalho manual usando nossa correção inteligente integrada diretamente na sua sala de aula.</p>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                  <ICONS.Check className="w-5 h-5 text-emerald-500" /> Importação instantânea de turmas
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                  <ICONS.Check className="w-5 h-5 text-emerald-500" /> Sincronização de rubricas pedagógicas
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                  <ICONS.Check className="w-5 h-5 text-emerald-500" /> Postagem de notas com um clique
                </li>
              </ul>

              <button 
                onClick={handleStartConnection}
                disabled={isConnecting}
                className="w-full py-4 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center gap-4 hover:border-indigo-600 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isConnecting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                ) : (
                  <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                )}
                <span className="font-bold text-gray-700">{isConnecting ? 'Autenticando...' : 'Conectar com Google Classroom'}</span>
              </button>
              <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">Ambiente 100% Seguro e Criptografado</p>
            </div>
            <div className="bg-indigo-600 p-10 flex items-center justify-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-20 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
               <div className="relative z-10 text-white space-y-4">
                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl rotate-3">
                    <img src="https://picsum.photos/seed/edu/400/250" className="rounded-2xl shadow-inner" alt="Preview" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-indigo-100">Visão Integrada</p>
                    <p className="text-xs text-indigo-200">Gerencie tudo de um só lugar</p>
                  </div>
               </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8 animate-in zoom-in-95 duration-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Google Classroom</h3>
              <p className="text-sm text-gray-500 mt-1">Status: <span className="text-emerald-600 font-bold uppercase tracking-tight">Ativo e Sincronizado</span></p>
            </div>
            <button 
              onClick={onDisconnect}
              className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
            >
              Desconectar conta
            </button>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm">
              <ICONS.CircleCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900">Tudo pronto!</p>
              <p className="text-xs text-emerald-700/80">O RIOS agora tem permissão para ler e escrever no seu Classroom de forma segura.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Escopos de Acesso Autorizados</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PERMISSIONS.map((perm, i) => (
                <div key={i} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/30 group hover:bg-white hover:border-indigo-100 transition-all">
                  <div className="shrink-0 mt-0.5 text-emerald-500 group-hover:scale-110 transition-transform">
                    <ICONS.CircleCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{perm.text}</p>
                    <p className="text-[10px] font-mono text-gray-400 mt-1">{perm.scope}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionsView;
