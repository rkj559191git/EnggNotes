import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Branches from './pages/Branches';
import Semesters from './pages/Semesters';
import BranchDetail from './pages/BranchDetail';
import SemesterDetail from './pages/SemesterDetail';
import SubjectDetail from './pages/SubjectDetail';
import NoteDetail from './pages/NoteDetail';
import Search from './pages/Search';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/semesters" element={<Semesters />} />
            <Route path="/branch/:branchCode" element={<BranchDetail />} />
            <Route path="/semester/:semesterNumber" element={<SemesterDetail />} />
            <Route path="/subject/:subjectId" element={<SubjectDetail />} />
            <Route path="/note/:noteId" element={<NoteDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
