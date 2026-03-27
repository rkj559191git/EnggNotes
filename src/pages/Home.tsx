 import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, type Branch, type Semester } from '../lib/supabase';
import AdPlaceholder from '../components/AdPlaceholder';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: branchData } = await supabase
      .from('branches')
      .select('*')
      .order('code');

    const { data: semesterData } = await supabase
      .from('semesters')
      .select('number')
      .order('number')
      .limit(8);

    if (branchData) setBranches(branchData);
    if (semesterData) setSemesters(semesterData);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const branchGradients = [
    'from-blue-500 to-blue-700',
    'from-green-500 to-green-700',
    'from-purple-500 to-purple-700',
    'from-orange-500 to-orange-700',
    'from-red-500 to-red-700',
  ];

  const branchIcons = ['💻', '🏗️', '⚡', '📡', '⚙️'];

  const semesterColors = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-green-400 to-green-600',
    'from-orange-400 to-orange-600',
    'from-red-400 to-red-600',
    'from-teal-400 to-teal-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600',
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Free Engineering Notes
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Download quality study materials for all engineering branches
            </p>
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search for subjects, topics, or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AdPlaceholder size="banner" className="mb-12 mx-auto" />

        {/* Browse by Branch */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Branch</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {branches.map((branch, index) => (
              <button
                key={branch.id}
                onClick={() => navigate(`/branch/${branch.code}`)}
                className={`bg-gradient-to-br ${branchGradients[index % branchGradients.length]} text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center relative overflow-hidden`}
              >
                <div className="text-4xl mb-3">{branchIcons[index % branchIcons.length]}</div>
                <div className="font-bold text-2xl mb-1">{branch.code}</div>
                <div className="text-sm opacity-90 font-medium leading-tight">{branch.name}</div>
                <div className="text-xs mt-2 opacity-70">View Notes →</div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-white bg-opacity-10 rounded-full"></div>
              </button>
            ))}
          </div>
        </section>

        <AdPlaceholder size="banner" className="mb-12 mx-auto" />

        {/* Browse by Semester */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Semester</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                onClick={() => navigate(`/semester/${num}`)}
                className={`bg-gradient-to-br ${semesterColors[num - 1]} text-white p-6 rounded-xl shadow-md hover:shadow-xl transition hover:opacity-90`}
              >
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{num}</div>
                  <div className="text-sm font-semibold">Semester</div>
                  <div className="text-xs mt-1 opacity-80">View Notes</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="mt-16 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About FreeEnggNotes</h2>
          <p className="text-gray-700 leading-relaxed">
            FreeEnggNotes is a platform dedicated to providing free, quality study materials for engineering students across India.
            We offer comprehensive notes covering all major branches including Computer Science, Mechanical, Civil, Electrical,
            and Electronics & Communication Engineering. Our notes are organized by semester and subject, making it easy for you
            to find exactly what you need for your exams and coursework.
          </p>
        </section>
      </div>
    </div>
  );
}