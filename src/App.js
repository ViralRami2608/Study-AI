import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import Notes from "./pages/Notes";
import StudyPlanner from "./pages/StudyPlanner";
import StudyTimer from "./pages/StudyTimer";


function App() {
  return (
    <BrowserRouter>

      <Sidebar />

      <Header />

      <Routes>

        {/* Default Route */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* AI Assistant */}

        <Route
          path="/ai-assistant"
          element={<AIAssistant />}
        />


        {/* Notes */}

        <Route
          path="/notes"
          element={<Notes />}
        />


        {/* Study Planner */}

        <Route
          path="/study-planner"
          element={<StudyPlanner />}
        />


        {/* Study Timer */}

        <Route
          path="/study-timer"
          element={<StudyTimer />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;