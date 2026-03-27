import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, type Note, type Subject, type Branch, type Semester } from '../lib/supabase';
import AdPlaceholder from '../components/AdPlaceholder';

export default function NoteDetail() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [semester, setSemester] = useState<Semester | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [noteId]);

  const fetchData = async () => {
    setLoading(true);

    const { data: noteData } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .maybeSingle();

    if (noteData) {
      setNote(noteData);

      await supabase
        .from('notes')
        .update({ views: noteData.views + 1 })
        .eq('id', noteData.id);

      const { data: subjectData } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', noteData.subject_id)
        .maybeSingle();

      if (subjectData) {
        setSubject(subjectData);

        const { data: branchData } = await supabase
          .from('branches')
          .select('*')
          .eq('id', subjectData.branch_id)
          .maybeSingle();

        const { data: semesterData } = await supabase
          .from('semesters')
          .select('*')
          .eq('id', subjectData.semester_id)
          .maybeSingle();

        if (branchData) setBranch(branchData);
        if (semesterData) setSemester(semesterData);
      }
    }

    setLoading(false);
  };

  const handleDownload = async () => {
    if (note) {
      await supabase
        .from('notes')
        .update({ downloads: note.downloads + 1 })
        .eq('id', note.id);

      window.open(note.pdf_url, '_blank');
    }
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/[-\w]{25,}/);
      if (fileIdMatch) {
        return `https://drive.google.com/file/d/${fileIdMatch[0]}/preview`;
      }
    }
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl">Note not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 mb-4 text-blue-100 text-sm">
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
            {subject && (
              <>
                <button onClick={() => navigate(`/subject/${subject.id}`)} className="hover:text-white transition">
                  {subject.name}
                </button>
                <span>›</span>
              </>
            )}
            <span className="text-white">{note.title}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{note.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-blue-100">
            {subject && <span className="bg-blue-700 px-3 py-1 rounded-full text-sm">{subject.code}</span>}
            {branch && <span>{branch.name}</span>}
            {semester && <span>•</span>}
            {semester && <span>{semester.name}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdPlaceholder size="banner" className="mb-8 mx-auto" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h2 className="font-semibold text-gray-900">PDF Viewer</h2>
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download</span>
                </button>
              </div>
              <div className="relative" style={{ paddingTop: '141.42%' }}>
                <iframe
                  src={getEmbedUrl(note.pdf_url)}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="autoplay"
                  title={note.title}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">About this Note</h3>
              {note.description && (
                <p className="text-gray-700 mb-4">{note.description}</p>
              )}
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{note.views + 1} views</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>{note.downloads} downloads</span>
                </div>
              </div>
            </div>

            <AdPlaceholder size="square" className="mb-6" />

            {subject && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-2">Subject</h3>
                <button
                  onClick={() => navigate(`/subject/${subject.id}`)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {subject.name} →
                </button>
              </div>
            )}
          </div>
        </div>

        <AdPlaceholder size="banner" className="mt-8 mx-auto" />
      </div>
    </div>
  );
}
