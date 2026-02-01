
import React, { useState } from 'react';
import { ICONS } from '../constants';

const REQUIRED_SCOPES = [
  { 
    id: "classroom.courses.readonly", 
    label: "Ver turmas", 
    desc: "Permite listar suas turmas ativas e arquivadas.",
    icon: <ICONS.Classroom className="w-4 h-4" />
  },
  { 
    id: "classroom.rosters.readonly", 
    label: "Ver alunos", 
    desc: "Acessa a lista de alunos e professores de cada turma.",
    icon: <ICONS.Assignments className="w-4 h-4" />
  },
  { 
    id: "classroom.student-submissions.students.readonly", 
    label: "Ver trabalhos", 
    desc: "Visualiza o status das entregas dos alunos.",
    icon: <ICONS.FileText className="w-4 h-4" />
  },
  { 
    id: "drive.readonly", 
    label: "Ler arquivos Drive", 
    desc: "Acessa os anexos (PDFs, docs) enviados pelos alunos.",
    icon: <ICONS.GoogleDrive className="w-4 h-4" />
  },
  { 
    id: "classroom.coursework.students", 
    label: "Enviar notas", 
    desc: "Permite postar as notas geradas pela IA no Classroom.",
    icon: <ICONS.Check className="w-4 h-4" />
  },
  { 
    id: "drive.file", 
    label: "Salvar feedbacks", 
    desc: "Cria arquivos de feedback detalhados no seu Drive.",
    icon: <ICONS.FilePlus className="w-4 h-4" />
  },
  { 
    id: "forms.responses.readonly", 
    label: "Respostas do Forms", 
    desc: "Acessa respostas para correção automática.",
    icon: <ICONS.Forms className="w-4 h-4" />
  },
];

interface GoogleClassroomConnectionProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const GoogleClassroomConnection: React.FC<GoogleClassroomConnectionProps> = ({ isConnected, onConnect, onDisconnect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  const handleAuthFlow = () => {
    setIsLoading(true);
    // Simulação do fluxo OAuth 2.0 Redirect
    setTimeout(() => {
      onConnect();
      setIsLoading(false);
    }, 2500);
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-100/40">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Lado Esquerdo: Status e Call to Action */}
        <div className="lg:col-span-5 p-10 bg-gradient-to-br from-white to-indigo-50/30 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-gray-50 flex items-center justify-center">
                <img src="https://www.google.com/favicon.ico" className="w-8 h-8" alt="Google" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Provedor</span>
                <h2 className="text-xl font-bold text-gray-900">Google Classroom</h2>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">
                {isConnected ? 'Sincronização Ativa' : 'Conecte sua Sala de Aula'}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {isConnected 
                  ? 'Sua conta está vinculada com segurança. Todas as permissões foram concedidas para o ciclo letivo atual.' 
                  : 'Integre o RIOS ao seu ecossistema Google para automatizar correções, feedbacks e gestão de notas.'}
              </p>
            </div>

            {isConnected && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in zoom-in-95 duration-500">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                  <ICONS.CircleCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-900">Status: Conectado</p>
                  <p className="text-[10px] text-emerald-700/80 font-medium">riosklass@gmail.com</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 space-y-3">
            {!isConnected ? (
              <button 
                onClick={handleAuthFlow}
                disabled={isLoading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ICONS.Link className="w-5 h-5" />
                )}
                <span>{isLoading ? 'Autenticando...' : 'Iniciar Fluxo de Conexão'}</span>
              </button>
            ) : (
              <button 
                onClick={onDisconnect}
                className="w-full py-4 bg-white border border-red-100 text-red-600 rounded-2xl font-bold hover:bg-red-50 hover:border-red-200 transition-all text-sm"
              >
                Desvincular conta
              </button>
            )}
            <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest font-black">OAuth 2.0 Secure Protocol</p>
          </div>
        </div>

        {/* Lado Direito: Permissões e Detalhes Técnicos */}
        <div className="lg:col-span-7 p-10 space-y-8 bg-white">
          <div className="flex items-center justify-between border-b border-gray-50 pb-6">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Escopos de Acesso</h4>
            <button 
              onClick={() => setShowPermissions(!showPermissions)}
              className="text-[10px] font-bold text-indigo-600 hover:underline"
            >
              {showPermissions ? 'Ocultar Detalhes' : 'Ver Detalhes Técnicos'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REQUIRED_SCOPES.map((scope) => (
              <div 
                key={scope.id} 
                className={`p-4 rounded-2xl border transition-all flex gap-4 items-start ${
                  isConnected 
                    ? 'bg-indigo-50/40 border-indigo-100/50' 
                    : 'bg-gray-50/50 border-gray-100 hover:border-indigo-200'
                }`}
              >
                <div className={`mt-0.5 p-2 rounded-xl flex items-center justify-center ${
                  isConnected ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'
                }`}>
                  {scope.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-gray-800">{scope.label}</p>
                    {isConnected && <ICONS.Check className="w-3 h-3 text-emerald-500" />}
                  </div>
                  {showPermissions && (
                    <p className="text-[10px] font-medium text-gray-500 leading-relaxed mt-1 animate-in fade-in duration-300">
                      {scope.desc}
                    </p>
                  )}
                  {showPermissions && (
                    <code className="block text-[8px] font-mono text-gray-400 bg-gray-100/50 px-1.5 py-0.5 rounded mt-2 border border-gray-100 w-fit">
                      auth/classroom.{scope.id.replace('classroom.', '')}
                    </code>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600 border border-indigo-50">
               <ICONS.Info className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-900">Privacidade em primeiro lugar</p>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                O RIOS CORREÇÃO segue os padrões de segurança do Google Cloud Platform. Não armazenamos suas senhas e o acesso aos arquivos é limitado estritamente ao necessário para a correção pedagógica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleClassroomConnection;
