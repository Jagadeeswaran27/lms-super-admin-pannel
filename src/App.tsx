import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import AuthProvider from './store/AuthContext';
import AuthRedirect from './components/protection/AuthRedirect';
import ProtectedRoute from './components/protection/ProtectedRoute';
import { SnackBarProvider } from './store/SnackBarContext';
import { ThemeProvider, createTheme } from '@mui/material';
import SubjectsToCategoriesPage from './pages/suggestions/SubjectsToCategoriesPage';
import { routes } from './utils/Routes';
import ManualSuggestionPage from './pages/suggestions/ManualSuggestionPage';
import CategoriesToSuperCategoriesPage from './pages/suggestions/CategoriesToSuperCategoriesPage';
import SubSubjectsToSubjectsPage from './pages/suggestions/SubSubjectsToSubjectsPage';
import SubjectsToSubSubjectsPage from './pages/suggestions/SubjectsToSubSubjectsPage';

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
                  path={routes.subjectsToCategories}
                  element={
                    <ProtectedRoute element={<SubjectsToCategoriesPage />} />
                  }
                />
                <Route
                  path={routes.suggestionManual}
                  element={
                    <ProtectedRoute element={<ManualSuggestionPage />} />
                  }
                />
                <Route
                  path={routes.categoriesToSuperCategories}
                  element={
                    <ProtectedRoute
                      element={<CategoriesToSuperCategoriesPage />}
                    />
                  }
                />
                <Route
                  path={routes.subSubjectsToSubjects}
                  element={
                    <ProtectedRoute element={<SubSubjectsToSubjectsPage />} />
                  }
                />
                <Route
                  path={routes.subjectsToSubSubjects}
                  element={
                    <ProtectedRoute element={<SubjectsToSubSubjectsPage />} />
                  }
                />
                <Route
                  path="*"
                  element={
                    <Navigate to={routes.subjectsToCategories} replace />
                  }
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
