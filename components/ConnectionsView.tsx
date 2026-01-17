
import React, { useState } from 'react';
import { ICONS } from '../constants';

const PERMISSIONS = [
  { text: "Veja os cursos que você está ministrando.", scope: "classroom.courses.readonly" },
  { text: "Veja os alunos que você está ensinando.", scope: "listas.de.aulas.somente.leitura" },
  { text: "Veja o tipo de trabalho enviado pelos alunos.", scope: "classroom.student-submissions.students.readonly" },
  { text: "Visualize os trabalhos dos alunos para corrigi-los (já que a autoria dos trabalhos dos alunos é transferida para você).", scope: "unidade.somente leitura" },
  { text: "Enviar notas de volta para o Google Classroom", scope: "sala de aula.trabalho de curso.alunos" },
  { text: "Envie seu feedback pelo Google Classroom (como um documento do Google que criamos em sua conta do Google).", scope: "drive.file" },
  { text: "Acesse as respostas do Formulário Google para avaliação.", scope: "formulários.respostas.somente leitura" },
  { text: "Associar os endereços de e-mail dos alunos entre o Google Forms e o Google Classroom", scope: "classroom.profile.emails" },
  { text: "Selecionar/criar tópicos ao criar tarefas", scope: "tópicos de sala de aula" },
  { text: "Receba notificações push via Pub/Sub para correção automática.", scope: "notificações-push-da-sala-de-aula" },
];

const ConnectionsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('google');

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>Painel</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span className="text-gray-900">Conexões</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conexões</h1>
          <p className="text-sm text-gray-500">Gerencie suas conexões de serviços externos.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-full">
        <button 
          onClick={() => setActiveTab('google')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'google' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Sala de aula do Google
        </button>
        <button 
          onClick={() => setActiveTab('tela')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'tela' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Tela
        </button>
        <button 
          disabled
          className="flex-1 py-2 text-sm font-semibold rounded-lg text-gray-400 cursor-not-allowed"
        >
          Microsoft Teams (Não disponível)
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Sala de aula do Google</h3>
          <p className="text-sm text-gray-500 mt-1">Conecte-se ao Google Classroom para sincronizar cursos, avaliar tarefas e enviar feedback.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ICONS.CircleCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Conectado ao Google Classroom</p>
            <p className="text-xs text-gray-500">Sua conta do Google Classroom está conectada.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-900">Permissões concedidas</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PERMISSIONS.map((perm, i) => (
              <div key={i} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/30">
                <div className="shrink-0 mt-0.5 text-emerald-500">
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

        <div className="pt-4">
          <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm">
            Desconectar do Google Classroom
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionsView;
