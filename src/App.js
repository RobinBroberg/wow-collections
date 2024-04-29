import './App.css';
import AllMounts from "./components/AllMounts";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AllAchievements from "./components/AllAchievements";
import CollectedMounts from "./components/CollectedMounts";

function App() {
  return (
      <Router>
        <div>

          <nav>
            <ul>
              <li>
                <Link to="/mounts">Mounts</Link>
              </li>
              <li>
                <Link to="/achievements">Achievements</Link>
              </li>
              <li>
                <Link to="/collectedMounts">Collected Mounts</Link>
              </li>
            </ul>
          </nav>


          <Routes>
            <Route path="/mounts" element={<AllMounts />} />
            <Route path="/collectedMounts" element={<CollectedMounts />} />
            <Route path="/achievements" element={<AllAchievements />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
