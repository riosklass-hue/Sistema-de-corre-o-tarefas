
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';
import { createChat } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AskKleoView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = createChat('Você é Kleo, um assistente pedagógico de IA para o sistema RIOS CORREÇÃO. Você ajuda professores do ensino técnico em administração com dúvidas sobre o sistema, rubricas, correção e pedagogia. Seja formal, útil e use um tom encorajador.');
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, tive um problema ao processar sua pergunta. Pode tentar novamente?' }]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    chatRef.current = createChat('Você é Kleo, um assistente pedagógico de IA para o sistema RIOS CORREÇÃO...');
  };

  const suggestions = [
    {
      title: "Comece a usar o RIOS CORREÇÃO",
      desc: "O que é o RIOS CORREÇÃO e como posso começar a usá-lo?",
      icon: <ICONS.FileText className="w-5 h-5 text-gray-400" />,
      prompt: "Como posso começar a usar o RIOS CORREÇÃO para corrigir minhas tarefas?"
    },
    {
      title: "Confira os resultados da avaliação",
      desc: "Mostre-me os resultados da avaliação da minha última tarefa do Google Classroom.",
      icon: <ICONS.BookOpen className="w-5 h-5 text-gray-400" />,
      prompt: "Como visualizo os resultados das avaliações das tarefas que já corrigi?"
    },
    {
      title: "Enviar resultados para a sala de aula",
      desc: "Como faço para enviar notas e comentários de uma tarefa enviada para o Google Classroom?",
      icon: <ICONS.Send className="w-5 h-5 text-gray-400" />,
      prompt: "Qual o passo a passo para enviar as notas da IA de volta para o Google Classroom?"
    },
    {
      title: "Formulário Google de notas",
      desc: "Explique-me como avaliar as respostas do meu questionário do Google Forms.",
      icon: <ICONS.ClipboardList className="w-5 h-5 text-gray-400" />,
      prompt: "Como funciona a integração com o Google Forms para correção automática?"
    }
  ];

  const showHero = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Breadcrumb & Top Bar */}
      <header className="flex justify-between items-center mb-8 shrink-0">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>Painel</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900">Pergunte à Kleo</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={startNewChat}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ICONS.Plus className="w-4 h-4" />
            Novo bate-papo
          </button>
          <button className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <ICONS.History className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col items-center">
        {showHero ? (
          <div className="flex-1 flex flex-col items-center justify-center -mt-16 w-full max-w-3xl animate-in fade-in duration-500">
            <h1 className="text-4xl font-semibold text-gray-900 mb-4 text-center">Olá, Cleiton</h1>
            <p className="text-lg text-gray-500 mb-12 text-center">Como posso te ajudar hoje?</p>

            {/* Suggestion Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s.prompt)}
                  className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-2xl text-left hover:border-indigo-300 hover:shadow-md transition-all group shadow-sm"
                >
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-1">{s.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="flex-1 w-full max-w-3xl overflow-y-auto space-y-6 px-4 py-8 custom-scrollbar"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center shadow-sm ${m.role === 'user' ? 'bg-indigo-600' : 'bg-white border border-gray-100'}`}>
                    {m.role === 'user' ? <span className="text-[10px] text-white font-bold">VOCÊ</span> : <ICONS.Bot className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-700 shadow-sm rounded-tl-none'}`}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                    <ICONS.Bot className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Input Area */}
      <div className="shrink-0 pb-12 pt-4 w-full max-w-3xl mx-auto px-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Pergunte à Kleo"
            className="w-full pl-6 pr-14 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-lg shadow-gray-200/50 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors shadow-md disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            <ICONS.ChevronUp className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[10px] text-gray-400 text-center mt-3 uppercase tracking-widest font-bold">Kleo pode cometer erros. Verifique informações importantes.</p>
      </div>
    </div>
  );
};

export default AskKleoView;
