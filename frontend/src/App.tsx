import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Make sure this is the correct import
import ReportPage from './pages/ReportPage';
import ViewPage from './pages/ViewPage';
import ViewDetailPage from './pages/ViewDetailPage';
import CollectedPage from './pages/CollectedPage';
import CollectedDetailPage from './pages/CollectedDetailPage';
import DonatedPage from './pages/DonatedPage';

import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-wrapper">
        <div className="main-content">
          <Routes>
            <Route path="/report" element={<ReportPage />} />
            <Route path="/view" element={<ViewPage />} />
            <Route path="/view/:id" element={<ViewDetailPage />} />
            <Route path="/collected" element={<CollectedPage />} />
            <Route path="/collected/:id" element={<CollectedDetailPage />} />
            <Route path="/donated" element={<DonatedPage />} />

          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
