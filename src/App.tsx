import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
// import RootPage from "./pages/RootPage";
import LoginPage from "./pages/LoginPage";
import AuthProvider from "./store/AuthContext";
import AuthRedirect from "./components/protection/AuthRedirect";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/protection/ProtectedRoute";
import { SnackBarProvider } from "./store/SnackBarContext";
import { ThemeProvider, createTheme } from "@mui/material";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: "'Poppins', sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <SnackBarProvider>
        <AuthProvider>
          <Router>
            <div className="font-poppins">
              <Routes>
                {/* <Route path="/" element={<RootPage />} /> */}
                <Route
                  path="/"
                  element={<AuthRedirect element={<LoginPage />} />}
                />
                <Route
                  path="/home"
                  element={<ProtectedRoute element={<HomePage />} />}
                />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </SnackBarProvider>
    </ThemeProvider>
  );
}

export default App;
