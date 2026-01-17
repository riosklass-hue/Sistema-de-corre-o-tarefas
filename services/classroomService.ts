
import { Course, Assignment, Submission, Student } from "../types";

const MOCK_COURSES: Course[] = [
  { 
    id: '2', 
    name: 'Gestão da qualidade', 
    ownerId: 'teacher_01'
  },
  { 
    id: '1', 
    name: 'Técnico em Administração.', 
    section: 'Orlando Matutino', 
    descriptionHeading: '7º Turma Técnico em Comércio Sede ( Supervisora Clara)',
    ownerId: 'teacher_01'
  },
];

const MOCK_ASSIGNMENTS: Assignment[] = [
  { 
    id: 'a1', 
    courseId: '1', 
    title: '4 situação geradora de aprendizagem', 
    maxPoints: 10, 
    status: 'PUBLISHED', 
    alternateLink: '#' 
  },
  { 
    id: 'a2', 
    courseId: '1', 
    title: '5º Situação Geradora de Aprendizagem (SGA)', 
    maxPoints: 10, 
    status: 'PUBLISHED', 
    alternateLink: '#' 
  },
  { 
    id: 'a3', 
    courseId: '1', 
    title: '3º Situação Geradora de Aprendizagem (SGA)', 
    maxPoints: 10, 
    status: 'PUBLISHED', 
    alternateLink: '#' 
  }
];

const MOCK_STUDENTS: Student[] = [
  { id: 'u1', name: 'Beatriz', status: 'NOT_GRADED' },
  { id: 'u2', name: 'Vinicius Correa', status: 'NOT_GRADED' },
  { id: 'u3', name: 'Dayana doresthan', status: 'NOT_GRADED' },
  { id: 'u4', name: 'Clara Taiane Duarte ...', status: 'NOT_GRADED' },
];

export const listCourses = async (): Promise<Course[]> => {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_COURSES), 500));
};

export const listAssignments = async (courseId: string): Promise<Assignment[]> => {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_ASSIGNMENTS.filter(a => a.courseId === courseId)), 800));
};

export const listStudents = async (courseId: string): Promise<Student[]> => {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_STUDENTS), 400));
};

export const getSubmission = async (assignmentId: string, userId?: string): Promise<Submission> => {
    return {
        id: 's1',
        userId: userId || 'u1',
        userName: 'Joao vitor Santos freire',
        assignmentId,
        studentResponse: 'Para realizar o planejamento estratégico, primeiro identifiquei as forças e fraquezas da empresa através da matriz SWOT. Em seguida, defini os objetivos SMART...',
        state: 'TURNED_IN',
        attachments: [
          { name: 'trabalho5.xlsx', type: 'Google Drive File', url: '#' }
        ]
    };
}
