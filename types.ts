
export interface Course {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  ownerId: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  maxPoints: number;
  status: 'DRAFT' | 'PUBLISHED' | 'GRADED';
  dueDate?: string;
  alternateLink: string;
}

export interface Student {
  id: string;
  name: string;
  status: 'GRADED' | 'NOT_GRADED' | 'PENDING';
}

export interface Attachment {
  name: string;
  type: string;
  url: string;
}

export interface Submission {
  id: string;
  userId: string;
  userName: string;
  assignmentId: string;
  draftGrade?: number;
  assignedGrade?: number;
  studentResponse: string;
  state: 'NEW' | 'CREATED' | 'TURNED_IN' | 'RETURNED' | 'RECLAIMED_BY_STUDENT';
  attachments?: Attachment[];
}

export interface RubricCriteria {
  id: string;
  title: string;
  description: string;
  levels: {
    score: number;
    title: string; // Excelente, Bom, Regular, Insuficiente
    description: string;
  }[];
}

export interface Rubric {
  id: string;
  name: string;
  criteria: RubricCriteria[];
}

export interface AIGradeResponse {
  score: number;
  pedagogicalFeedback: string;
  improvementSuggestions: string[];
  justification: string;
}
