import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bolumData from '../data/departments';
import { BookOpen, ChevronRight, Search } from 'lucide-react';

const DepartmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaculty, setExpandedFaculty] = useState(null);

  const { faculties, departments } = bolumData;

  const filteredFaculties = faculties.filter((faculty) => {
    const matchesFaculty = faculty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departments[faculty]?.some((dept) =>
      dept.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesFaculty || matchesDepartment;
  });

  const toggleFaculty = (faculty) => {
    setExpandedFaculty(expandedFaculty === faculty ? null : faculty);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bölümler</h1>
        <p className="text-gray-600">Fakülte ve bölümlere göre notları inceleyin</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Fakülte veya bölüm ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Faculties List */}
      <div className="space-y-4">
        {filteredFaculties.map((faculty) => (
          <div key={faculty} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleFaculty(faculty)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="h-6 w-6 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">{faculty}</h2>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  expandedFaculty === faculty ? 'rotate-90' : ''
                }`}
              />
            </button>

            {expandedFaculty === faculty && (
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {departments[faculty]?.map((department) => (
                    <Link
                      key={department}
                      to={`/department/${encodeURIComponent(faculty)}/${encodeURIComponent(department)}`}
                      className="block p-3 bg-white rounded-lg hover:bg-primary-50 hover:border-primary-300 border border-gray-200 transition"
                    >
                      <span className="text-sm font-medium text-gray-700 hover:text-primary-700">
                        {department}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredFaculties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Arama sonucu bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;