
import React, { useState, useEffect } from 'react';
import { Assignment, Course, Student, Submission } from '../types';
import { listStudents, getSubmission } from '../services/classroomService';
import { ICONS } from '../constants';

interface GradeAssignmentViewProps {
  course: Course;
  assignment: Assignment;
  onBack: () => void;
  onGradeClick: (submission: Submission) => void;
  onConfigureClick?: () => void;
}

const GradeAssignmentView: React.FC<GradeAssignmentViewProps> = ({ course, assignment, onBack, onGradeClick, onConfigureClick }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const fetchedStudents = await listStudents(course.id);
      setStudents(fetchedStudents);
      if (fetchedStudents.length > 0) {
        setSelectedStudentId(fetchedStudents[0].id);
      }
      setLoading(false);
    };
    fetch();
  }, [course, assignment]);

  useEffect(() => {
    if (selectedStudentId) {
      const fetchSubmission = async () => {
        const sub = await getSubmission(assignment.id, selectedStudentId);
        setSubmission(sub);
      };
      fetchSubmission();
    }
  }, [selectedStudentId, assignment]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>Dashboard</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span>Google Classroom</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span>{course.name}.</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span className="text-gray-900 truncate max-w-xs">Grade: {assignment.title}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2.5 hover:bg-white rounded-full transition-colors border border-gray-200 bg-gray-50/50">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Grade Assignment</h1>
              <p className="text-sm text-gray-500">{assignment.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Export PDFs
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              Send All to Classroom
            </button>
            <div className="flex">
               <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-l-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
                  <ICONS.Robot className="w-4 h-4" />
                  Grade All
               </button>
               <button className="px-2 bg-indigo-600 border-l border-indigo-500 text-white rounded-r-lg hover:bg-indigo-700">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
               </button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Column: Students List */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-6 border-b border-gray-50 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Students</h3>
              <p className="text-sm text-gray-500">Students pending grading and those with saved results are shown.</p>
            </div>
            
            <div className="relative">
              <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              />
            </div>

            <div className="relative">
              <select className="w-full appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                <option>All Statuses</option>
                <option>Graded</option>
                <option>Not Graded</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {students.map((student) => (
              <button 
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl transition-all ${selectedStudentId === student.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}
              >
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                </div>
                <span className={`text-sm font-medium ${selectedStudentId === student.id ? 'text-blue-700' : 'text-gray-700'}`}>
                  {student.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Submission Detail */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-[600px] flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Student Submission</h3>
              <p className="text-sm text-gray-500">Viewing submission for {submission?.userName}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={onConfigureClick}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Configurar Atribuição
              </button>
              <button 
                disabled={!submission}
                onClick={() => submission && onGradeClick(submission)}
                className="px-6 py-2 bg-indigo-600/40 text-white rounded-lg text-sm font-bold shadow-sm cursor-not-allowed"
              >
                Grade Student
              </button>
            </div>
          </div>

          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 mb-8 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div>
              <p className="font-bold text-gray-800">Not Graded</p>
              <p className="text-sm text-gray-500">This submission has not been graded yet. Click "Grade Student" to start grading.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900">Attachments:</h4>
            
            {submission?.attachments?.map((att, i) => (
              <div key={i} className="bg-yellow-50/30 border border-yellow-100 rounded-xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-yellow-50 transition-colors">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
                   <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
                </div>
                <div>
                   <p className="font-bold text-gray-800 underline decoration-gray-300 group-hover:decoration-gray-600">{att.name}</p>
                   <p className="text-xs text-gray-500">Type: {att.type} (Unsupported for grading)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeAssignmentView;
