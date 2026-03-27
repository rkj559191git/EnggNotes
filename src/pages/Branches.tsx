 import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Branches() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const { data } = await supabase.from('branches').select('*').order('code');
    if (data) setBranches(data);
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Browse by Branch</h1>
        <p className="text-blue-100 text-lg">Select your engineering branch</p>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              onClick={() => navigate(`/branch/${branch.code}`)}
              className="bg-white rounded-2xl p-8 text-center cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md"
            >
              <div className="text-4xl font-bold text-blue-600 mb-3">{branch.code}</div>
              <div className="text-lg font-semibold text-gray-800">{branch.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
