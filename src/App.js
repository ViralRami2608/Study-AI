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

      </Routes>

    </BrowserRouter>
  );
}

export default App;