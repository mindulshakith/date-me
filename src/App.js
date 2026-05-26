import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProposalPage from './pages/ProposalPage';
import DatePlannerPage from './pages/DatePlannerPage';
import RejectedPage from './pages/RejectedPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProposalPage />} />
        <Route path="/date-planner" element={<DatePlannerPage />} />
        <Route path="/farewell" element={<RejectedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
