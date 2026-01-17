
import React from 'react';
import { Course } from '../types';
import { ICONS } from '../constants';

interface ClassroomSelectionViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

const ClassroomSelectionView: React.FC<ClassroomSelectionViewProps> = ({ courses, onSelectCourse }) => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>Dashboard</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          <span className="text-gray-900">Google Classroom</span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Google Classroom</h1>
            <p className="text-sm text-gray-500">Choose a Google Classroom with an assignment you want to grade</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md">
            <ICONS.ExternalLink className="w-4 h-4" />
            Open Google Classroom
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-4">
        {courses.map((course) => (
          <div 
            key={course.id}
            onClick={() => onSelectCourse(course)}
            className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group relative flex flex-col min-h-[160px]"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors pr-10">
                {course.name}
              </h3>
              <div className="flex gap-2">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <ICONS.EyeOff className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <ICONS.ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-auto">
              {course.section && <p className="text-sm font-bold text-gray-700">{course.section}</p>}
              {course.descriptionHeading && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2 italic">{course.descriptionHeading}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassroomSelectionView;
