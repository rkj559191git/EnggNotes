   import { useParams, useNavigate } from 'react-router-dom';

const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

const semesterColors = [
  'from-blue-500 to-blue-700',
  'from-purple-500 to-purple-700',
  'from-green-500 to-green-700',
  'from-orange-500 to-orange-700',
  'from-red-500 to-red-700',
  'from-teal-500 to-teal-700',
  'from-pink-500 to-pink-700',
  'from-indigo-500 to-indigo-700',
];

export default function BranchDetail() {
  const { branchCode } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">{branchCode} Branch</h1>
        <p className="text-blue-100 text-lg">Select your semester to browse notes</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Choose Semester
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {semesters.map((sem, index) => (
            <div
              key={sem}
              onClick={() => navigate(`/semester/${sem}?branch=${branchCode}`)}
              className={`bg-gradient-to-br ${semesterColors[index]} rounded-2xl p-8 text-white text-center cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg`}
            >
              <div className="text-5xl font-bold mb-3">{sem}</div>
              <div className="text-lg font-semibold">Semester</div>
              <div className="text-sm mt-2 opacity-80">View Notes</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}