import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, type Subject, type Note, type Branch } from '../lib/supabase';
import AdPlaceholder from '../components/AdPlaceholder';

export default function SubjectDetail() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [subjectId]);

  const fetchData = async () => {
    setLoading(true);

    const { data: subjectData } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', subjectId)
      .maybeSingle();

    if (subjectData) {
      setSubject(subjectData);

      const { data: notesData } = await supabase
        .from('notes')
        .select('*')
        .eq('subject_id', subjectData.id)
        .order('unit', { ascending: true });

      const { data: branchData } = await supabase
        .from('branches')
        .select('*')
        .eq('code', subjectData.branch_code)
        .maybeSingle();

      if (notesData) setNotes(notesData);
      if (branchData) setBranch(branchData);
    }

    setLoading(false);
  };

  const isUnitWise = notes.some(n => n.unit !== null);

  const cardColors = [
    { border: 'border-blue-400', bg: 'bg-blue-50', btn: 'bg-blue-600 hover:bg-blue-700', text: 'text-blue-700' },
    { border: 'border-purple-400', bg: 'bg-purple-50', btn: 'bg-purple-600 hover:bg-purple-700', text: 'text-purple-700' },
    { border: 'border-green-400', bg: 'bg-green-50', btn: 'bg-green-600 hover:bg-green-700', text: 'text-green-700' },
    { border: 'border-orange-400', bg: 'bg-orange-50', btn: 'bg-orange-600 hover:bg-orange-700', text: 'text-orange-700' },
    { border: 'border-red-400', bg: 'bg-red-50', btn: 'bg-red-600 hover:bg-red-700', text: 'text-red-700' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl">Subject not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 mb-4 text-blue-100">
            <button onClick={() => navigate('/')} className="hover:text-white transition">Home</button>
            <span>›</span>
            {branch && (
              <>
                <button onClick={() => navigate(`/branch/${branch.code}`)} className="hover:text-white transition">
                  {branch.code}
                </button>
                <span>›</span>
              </>
            )}
            <span className="text-white">{subject.name}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{subject.name}</h1>
          <div className="flex items-center space-x-4 text-blue-100">
            <span className="bg-blue-700 px-3 py-1 rounded-full text-sm">{subject.code}</span>
            {branch && <span>{branch.name}</span>}
            <span>•</span>
            <span>Semester {subject.semester}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdPlaceholder size="banner" className="mb-12 mx-auto" />

        {notes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 text-lg">No notes available yet</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for updates</p>
          </div>

        ) : isUnitWise ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Units</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-12">
              {notes
                .sort((a, b) => (a.unit || 0) - (b.unit || 0))
                .map((note, index) => {
                  const color = cardColors[index % cardColors.length];
                  return (
                    <div
                      key={note.id}
                      className={`border-2 ${color.border} ${color.bg} rounded-2xl p-5 flex flex-col items-center text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                    >
                      <div className="text-5xl mb-3">📄</div>
                      <h3 className={`font-bold ${color.text} text-sm mb-4 leading-tight flex-1`}>
                        {note.title}
                      </h3>
                      <button
                        onClick={() => navigate(`/note/${note.id}`)}
                        className={`${color.btn} text-white px-5 py-2 rounded-lg transition text-sm font-medium flex items-center gap-1 mt-2`}
                      >
                        📥 View
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Notes ({notes.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div key={note.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition border border-gray-200">
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{note.title}</h3>
                    {note.description && (
                      <p className="text-gray-600 text-sm mb-4">{note.description}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {note.views || 0}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {note.downloads || 0}
                      </span>
                    </div>
                    <a
                      href={note.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium block text-center"
                    >
                      View Note
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <AdPlaceholder size="banner" className="mt-12 mx-auto" />
      </div>
    </div>
  );
}