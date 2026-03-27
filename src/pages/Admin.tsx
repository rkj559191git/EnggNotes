import { useState, useEffect } from 'react';
import { supabase, type Branch, type Subject } from '../lib/supabase';

export default function Admin() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    branch_code: '',
    semester: '',
  });

  const [noteForm, setNoteForm] = useState({
    title: '',
    description: '',
    subject_id: '',
    file_url: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: branchData } = await supabase.from('branches').select('*').order('code');
    const { data: subjectData } = await supabase.from('subjects').select('*').order('name');
    if (branchData) setBranches(branchData);
    if (subjectData) setSubjects(subjectData);
  };

  const handleSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('subjects').insert([{
      name: subjectForm.name,
      code: subjectForm.code,
      branch_code: subjectForm.branch_code,
      semester: parseInt(subjectForm.semester)
    }]);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Subject added successfully!' });
      setSubjectForm({ name: '', code: '', branch_code: '', semester: '' });
      setShowSubjectForm(false);
      fetchData();
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('notes').insert([{
      title: noteForm.title,
      description: noteForm.description,
      subject_id: noteForm.subject_id,
      file_url: noteForm.file_url,
      views: 0,
      downloads: 0
    }]);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Note added successfully!' });
      setNoteForm({ title: '', description: '', subject_id: '', file_url: '' });
      setShowNoteForm(false);
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
          <p className="text-blue-100 text-lg">Manage subjects and notes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setShowSubjectForm(!showSubjectForm)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-2 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Add New Subject</h3>
                <p className="text-gray-600">Create a new subject for a branch and semester</p>
              </div>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => setShowNoteForm(!showNoteForm)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-2 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Add New Note</h3>
                <p className="text-gray-600">Upload a new note to an existing subject</p>
              </div>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </button>
        </div>

        {showSubjectForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Subject</h2>
            <form onSubmit={handleSubjectSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Subject Name</label>
                <input
                  type="text"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Data Structures"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Subject Code</label>
                <input
                  type="text"
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., CSE3-01"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Branch</label>
                  <select
                    value={subjectForm.branch_code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, branch_code: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.code}>
                        {branch.name} ({branch.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Semester</label>
                  <select
                    value={subjectForm.semester}
                    onChange={(e) => setSubjectForm({ ...subjectForm, semester: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1,2,3,4,5,6,7,8].map((num) => (
                      <option key={num} value={num}>Semester {num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
                  Add Subject
                </button>
                <button type="button" onClick={() => setShowSubjectForm(false)} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {showNoteForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Note</h2>
            <form onSubmit={handleNoteSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Note Title</label>
                <input
                  type="text"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Engineering Mathematics-I Full Notes"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Subject</label>
                <select
                  value={noteForm.subject_id}
                  onChange={(e) => setNoteForm({ ...noteForm, subject_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} - Sem {subject.semester} ({subject.branch_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">PDF URL</label>
                <input
                  type="url"
                  value={noteForm.file_url}
                  onChange={(e) => setNoteForm({ ...noteForm, file_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://drive.google.com/file/d/..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  value={noteForm.description}
                  onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Brief description of the note"
                  rows={3}
                />
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium">
                  Add Note
                </button>
                <button type="button" onClick={() => setShowNoteForm(false)} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{branches.length}</div>
              <div className="text-gray-600 text-sm">Branches</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{subjects.length}</div>
              <div className="text-gray-600 text-sm">Subjects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}