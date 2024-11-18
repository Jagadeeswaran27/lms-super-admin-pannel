import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import AuthProvider from "./store/AuthContext";
import AuthRedirect from "./components/protection/AuthRedirect";
import ProtectedRoute from "./components/protection/ProtectedRoute";
import { SnackBarProvider } from "./store/SnackBarContext";
import { ThemeProvider, createTheme } from "@mui/material";
import SuggestionPage from "./pages/suggestions/SuggestionPage";
import { routes } from "./utils/Routes";
import ManualSuggestionPage from "./pages/suggestions/ManualSuggestionPage";

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
                <Route
                  path={routes.login}
                  element={<AuthRedirect element={<LoginPage />} />}
                />
                <Route
                  path={routes.suggestions}
                  element={<ProtectedRoute element={<SuggestionPage />} />}
                />
                <Route
                  path={routes.suggestionManual}
                  element={
                    <ProtectedRoute element={<ManualSuggestionPage />} />
                  }
                />
                <Route
                  path="*"
                  element={<Navigate to="/suggestions" replace />}
                />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </SnackBarProvider>
    </ThemeProvider>
  );
}

export default App;
