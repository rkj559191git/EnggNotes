import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, type Semester } from '../lib/supabase';
import AdPlaceholder from '../components/AdPlaceholder';

export default function Semesters() {
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('semesters')
      .select('*')
      .order('number');

    if (data) setSemesters(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading semesters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Browse by Semester</h1>
          <p className="text-blue-100 text-lg">Select your semester to view available notes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdPlaceholder size="banner" className="mb-12 mx-auto" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {semesters.map((semester) => (
            <button
              key={semester.id}
              onClick={() => navigate(`/semester/${semester.number}`)}
              className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">{semester.number}</div>
                <div className="text-lg font-medium">{semester.name}</div>
                <div className="mt-4 text-blue-100 text-sm">Click to view notes</div>
              </div>
            </button>
          ))}
        </div>

        <AdPlaceholder size="banner" className="mt-12 mx-auto" />

        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use</h2>
          <div className="space-y-3 text-gray-700">
            <p>1. Select your semester from the options above</p>
            <p>2. Choose your branch (if applicable)</p>
            <p>3. Browse available subjects for that semester</p>
            <p>4. Download notes directly or view them online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
