import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import RootPage from "./pages/RootPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootPage />} />
      </Routes>
    </Router>
  );
}

export default App;
