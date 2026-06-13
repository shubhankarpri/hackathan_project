import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { MoodCheckin } from "./pages/MoodCheckin";
import { Journal } from "./pages/Journal";
import { Dashboard } from "./pages/Dashboard";
import { Coach } from "./pages/Coach";
import { Mindfulness } from "./pages/Mindfulness";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/check-in" element={<MoodCheckin />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/mindfulness" element={<Mindfulness />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
