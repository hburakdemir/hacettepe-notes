import React, { useState } from "react";
import { Link } from "react-router-dom";
import bolumData from "../data/departments";
import { Library, ChevronRight, Search } from "lucide-react";

const DepartmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaculty, setExpandedFaculty] = useState(null);

  const { faculties, departments } = bolumData;

  console.log("Faculties:", faculties);
  console.log("Departments:", departments);
  console.log("Tüm bolumData:", bolumData);

  const filteredFaculties = faculties.filter((faculty) => {
    const matchesFaculty = faculty
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment = departments[faculty]?.some((dept) =>
      dept.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesFaculty || matchesDepartment;
  });

  const toggleFaculty = (faculty) => {
    setExpandedFaculty(expandedFaculty === faculty ? null : faculty);
  };

  return (
    <div className="bg-primary dark:bg-darkbg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-darktext">
            Fakülteler ve Bölümler
          </h1>
          <p className="text-gray-600 dark:text-darktext">
            Fakülte ve bölümlere göre notları inceleyin
          </p>
        </div>

        {/* Search */}
        <div className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#5A9690]" />
            <input
              type="text"
              placeholder="Fakülte veya bölüm ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent"
            />
          </div>
        </div>

        {/* fakülte listesi */}
        <div className="space-y-4">
          {filteredFaculties.map((faculty) => (
            <div
              key={faculty}
              className="bg-primary dark:bg-darkbgbutton rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFaculty(faculty)}
                className="w-full px-6 py-4 flex items-center justify-between transition"
              >
                <div className="flex items-center space-x-3">
                  <Library className="h-6 w-6 text-[#5A9690]" />
                  <h2 className="text-lg text-left font-semibold text-gray-900 dark:text-darktext">
                    {faculty}
                  </h2>
                </div>
                <ChevronRight
                  className={`h-5 w-5 text-[#2F5755] transition-transform ${
                    expandedFaculty === faculty ? "rotate-90" : ""
                  }`}
                />
              </button>

              {expandedFaculty === faculty && (
                <div className="border-t border-gray-200 bg-gray-50 dark:bg-darkbgbutton px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {departments[faculty]?.map((department) => (
                      <Link
                        key={department}
                        to={`/department/${encodeURIComponent(faculty)}/${encodeURIComponent(department)}`}
                        className="block p-3 bg-primary rounded-lg hover:bg-[#E0D9D9] dark:bg-darkbgbutton border border-gray-400 transition hover:text-red-800"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-darktext ">
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
    </div>
  );
};

export default DepartmentsPage;
