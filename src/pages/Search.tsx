import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase, type Note, type Subject } from '../lib/supabase';
import AdPlaceholder from '../components/AdPlaceholder';

interface NoteWithSubject extends Note {
  subject?: Subject;
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<NoteWithSubject[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchNotes();
    }
  }, [query]);

  const searchNotes = async () => {
    setLoading(true);

    const searchTerm = `%${query}%`;

    const { data: subjectsData } = await supabase
      .from('subjects')
      .select('*')
      .ilike('name', searchTerm);

    const { data: notesData } = await supabase
      .from('notes')
      .select('*')
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);

    if (subjectsData) {
      setSubjects(subjectsData);
    }

    if (notesData && subjectsData) {
      const notesWithSubjects = await Promise.all(
        notesData.map(async (note) => {
          const { data: subjectData } = await supabase
            .from('subjects')
            .select('*')
            .eq('id', note.subject_id)
            .maybeSingle();

          return {
            ...note,
            subject: subjectData || undefined
          };
        })
      );

      setResults(notesWithSubjects);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Search Results</h1>
          <p className="text-blue-100 text-lg">
            Found {results.length} notes and {subjects.length} subjects for "{query}"
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdPlaceholder size="banner" className="mb-12 mx-auto" />

        {subjects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Subjects ({subjects.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => navigate(`/subject/${subject.id}`)}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-blue-500 text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      {subject.code}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{subject.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{subject.description}</p>
                  <div className="mt-4 text-blue-600 font-medium text-sm">View Subject →</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {results.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notes ({results.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition border border-gray-200"
                >
                  <div className="p-6">
                    {note.subject && (
                      <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium mb-3">
                        {note.subject.name}
                      </span>
                    )}
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{note.title}</h3>
                    {note.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.description}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {note.views}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {note.downloads}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/note/${note.id}`)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      View Note
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {results.length === 0 && subjects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-600 text-lg mb-2">No results found for "{query}"</p>
            <p className="text-gray-500 text-sm">Try a different search term</p>
          </div>
        )}

        <AdPlaceholder size="banner" className="mt-12 mx-auto" />
      </div>
    </div>
  );
}
