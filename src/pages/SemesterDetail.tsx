import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase, type Subject, type Branch } from '../lib/supabase';
import AdPlaceholder from '../components/AdPlaceholder';

const subjectIcons = ['📐', '⚡', '💻', '🔬', '📊', '🧮', '🔧', '📡', '🧠', '🌐'];

const cardGradients = [
  'from-blue-500 to-blue-700',
  'from-purple-500 to-purple-700',
  'from-green-500 to-green-700',
  'from-orange-500 to-orange-700',
  'from-red-500 to-red-700',
  'from-teal-500 to-teal-700',
  'from-pink-500 to-pink-700',
  'from-indigo-500 to-indigo-700',
  'from-yellow-500 to-yellow-700',
  'from-cyan-500 to-cyan-700',
];

export default function SemesterDetail() {
  const { semesterNumber } = useParams();
  const [searchParams] = useSearchParams();
  const branchFromUrl = searchParams.get('branch');
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>(branchFromUrl || 'all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [semesterNumber]);

  const fetchData = async () => {
    setLoading(true);
    const { data: branchData } = await supabase.from('branches').select('*').order('code');
    const { data: subjectData } = await supabase.from('subjects').select('*').eq('semester', Number(semesterNumber)).order('name');
    if (branchData) setBranches(branchData);
    if (subjectData) setSubjects(subjectData);
    setLoading(false);
  };

   const filteredSubjects = selectedBranch === 'all'
  ? subjects
  : subjects.filter(s => s.branch_id === selectedBranch);

const getSubjectsByBranch = (branchCode: string) => {
  return subjects.filter(s => s.branch_id === branchCode);
};

  const SubjectCard = ({ subject, index }: { subject: Subject; index: number }) => (
    <div
      onClick={() => navigate(`/subject/${subject.id}`)}
      className="cursor-pointer group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Gradient Background */}
      <div className={`bg-gradient-to-br ${cardGradients[index % cardGradients.length]} p-6 h-full`}>
        {/* Icon */}
        <div className="text-4xl mb-4 opacity-90">
          {subjectIcons[index % subjectIcons.length]}
        </div>

        {/* Subject Name */}
        <h3 className="text-white font-bold text-lg mb-2 leading-tight">
          {subject.name}
        </h3>

        {/* Code Badge */}
        <span className="inline-block bg-white bg-opacity-20 text-white text-xs px-3 py-1 rounded-full mb-4">
          {subject.code}
        </span>

        {/* View Notes Button */}
        <div className="flex items-center text-white text-sm font-medium mt-2 group-hover:translate-x-1 transition-transform duration-200">
          View Notes
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Decorative circle */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white bg-opacity-10 rounded-full"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate(-1)} className="text-blue-100 hover:text-white transition mb-4 block">
            ← Back
          </button>
          <h1 className="text-4xl font-bold mb-2">Semester {semesterNumber}</h1>
          <p className="text-blue-100 text-lg">Browse subjects and download notes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdPlaceholder size="banner" className="mb-12 mx-auto" />

        {/* Branch Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedBranch('all')}
            className={`px-5 py-2 rounded-full font-medium transition ${selectedBranch === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-500'}`}
          >
            All Branches
          </button>
          {branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => setSelectedBranch(branch.code)}
              className={`px-5 py-2 rounded-full font-medium transition ${selectedBranch === branch.code ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-500'}`}
            >
              {branch.code}
            </button>
          ))}
        </div>

        {selectedBranch === 'all' ? (
          branches.map((branch) => {
            const branchSubjects = getSubjectsByBranch(branch.code);
            if (branchSubjects.length === 0) return null;
            return (
              <div key={branch.id} className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="h-8 w-1 bg-blue-600 rounded mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-900">{branch.name}
                    <span className="ml-2 text-blue-600 text-lg">({branch.code})</span>
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {branchSubjects.map((subject, index) => (
                    <SubjectCard key={subject.id} subject={subject} index={index} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredSubjects.map((subject, index) => (
                <SubjectCard key={subject.id} subject={subject} index={index} />
              ))}
            </div>
            {filteredSubjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No subjects available yet</p>
              </div>
            )}
          </>
        )}

        <AdPlaceholder size="banner" className="mt-12 mx-auto" />
      </div>
    </div>
  );
}