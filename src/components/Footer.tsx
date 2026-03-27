export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">FreeEnggNotes</h3>
            <p className="text-gray-400">
              Free engineering notes for students across India. Download study materials for all branches and semesters.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/branches" className="text-gray-400 hover:text-white transition">Browse by Branch</a></li>
              <li><a href="/semesters" className="text-gray-400 hover:text-white transition">Browse by Semester</a></li>
              <li><a href="/admin" className="text-gray-400 hover:text-white transition">Admin Panel</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Branches</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-400">Computer Science (CSE)</span></li>
              <li><span className="text-gray-400">Mechanical (ME)</span></li>
              <li><span className="text-gray-400">Civil (CE)</span></li>
              <li><span className="text-gray-400">Electrical (EE)</span></li>
              <li><span className="text-gray-400">Electronics (EC)</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 FreeEnggNotes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
