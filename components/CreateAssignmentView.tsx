
import React, { useState } from 'react';
import { Course } from '../types';
import { ICONS } from '../constants';

interface CreateAssignmentViewProps {
  courses: Course[];
  selectedCourse: Course | null;
  onBack: () => void;
  onCreate: (data: any) => void;
}

const CreateAssignmentView: React.FC<CreateAssignmentViewProps> = ({ courses, selectedCourse, onBack, onCreate }) => {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [points, setPoints] = useState('');
  const [topic, setTopic] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>(selectedCourse ? [selectedCourse.id] : []);
  const [scheduling, setScheduling] = useState('immediate');

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId) 
        : [...prev, courseId]
    );
  };

  const handleSubmit = () => {
    if (!title) {
      alert('O título da tarefa é obrigatório.');
      return;
    }
    onCreate({
      title,
      instructions,
      points,
      topic,
      dueDate,
      dueTime,
      selectedCourses,
      scheduling
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>Painel</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span className="text-gray-900">Criar nova tarefa</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 hover:bg-white rounded-full transition-colors border border-gray-200 bg-gray-50/50">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Criar nova tarefa</h1>
            <p className="text-sm text-gray-500">Preencha os detalhes para criar uma nova tarefa no Google Classroom.</p>
          </div>
        </div>
      </header>

      {/* Details Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <h3 className="text-lg font-bold text-gray-900">Detalhes da tarefa</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Título da tarefa <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="Exemplo: Tarefa de Leitura do Capítulo 5"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Instruções (Opcional)</label>
            <textarea 
              placeholder="Insira as instruções que são mostradas aos alunos como descrição da tarefa..."
              className="w-full h-32 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Pontos (Opcional)</label>
              <input 
                type="text" 
                placeholder="Exemplo: 100"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Tópico (Opcional)</label>
              <div className="relative">
                <select 
                  className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="">Selecione um tópico ou crie um novo.</option>
                  <option value="topic1">Tópico 1</option>
                  <option value="topic2">Tópico 2</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Data de vencimento (opcional)</label>
              <div className="relative">
                <ICONS.Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Prazo de entrega (opcional)</label>
              <div className="relative">
                <ICONS.Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="time" 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <h3 className="text-lg font-bold text-gray-900">Anexar materiais (opcional)</h3>
        <div className="flex flex-wrap gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors">
            <ICONS.GoogleDrive className="w-4 h-4" />
            Adicionar do Google Drive
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors">
            <ICONS.YouTube className="w-4 h-4" />
            Adicionar vídeo do YouTube
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors">
            <ICONS.Plus className="w-4 h-4" />
            Criar
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            Carregar arquivo
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors">
            <ICONS.Link className="w-4 h-4" />
            Adicionar link
          </button>
        </div>
      </section>

      {/* Assign to Courses Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <h3 className="text-lg font-bold text-gray-900">Atribuir aos cursos</h3>
        <div className="space-y-4">
          {courses.map(course => (
            <label key={course.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/30 cursor-pointer hover:bg-indigo-50/30 transition-colors">
              <input 
                type="checkbox" 
                className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                checked={selectedCourses.includes(course.id)}
                onChange={() => toggleCourseSelection(course.id)}
              />
              <div>
                <p className="text-sm font-bold text-gray-800">{course.name}</p>
                {course.section && <p className="text-xs text-gray-400">{course.section}</p>}
              </div>
            </label>
          ))}
          <label className="flex items-center gap-3 mt-4 text-xs font-semibold text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors">
            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
            Selecione alunos específicos (opcional)
          </label>
        </div>
      </section>

      {/* Scheduling Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <h3 className="text-lg font-bold text-gray-900">Opções de agendamento</h3>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="radio" 
              name="scheduling" 
              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              checked={scheduling === 'immediate'}
              onChange={() => setScheduling('immediate')}
            />
            <span className="text-sm text-gray-700 font-bold">Publique Imediatamente</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="radio" 
              name="scheduling" 
              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              checked={scheduling === 'later'}
              onChange={() => setScheduling('later')}
            />
            <span className="text-sm text-gray-700">Agendamento para mais tarde</span>
          </label>
        </div>
      </section>

      {/* Final Action Button */}
      <div className="fixed bottom-0 right-0 left-64 bg-white border-t border-gray-100 p-4 px-8 flex justify-end z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <button 
          onClick={handleSubmit}
          className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
        >
          Criar tarefa
        </button>
      </div>
    </div>
  );
};

export default CreateAssignmentView;
