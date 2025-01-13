import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import AdminLayout from './components/layout/AdminLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import GroupsPage from './pages/GroupsPage';
import LogsPage from './pages/LogsPage';
import MetricsPage from './pages/MetricsPage';
import PermissionsPage from './pages/PermissionsPage';
import ModelsPage from './pages/ModelsPage';
import ErrorsPage from './pages/ErrorsPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';

function App() {
  // Tema
  const [mode, setMode] = React.useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2196f3'
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#f5f5f5',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
        },
      }),
    [mode],
  );

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas protegidas */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route index element={<DashboardPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="groups" element={<GroupsPage />} />
                    <Route path="logs" element={<LogsPage />} />
                    <Route path="metrics" element={<MetricsPage />} />
                    <Route path="permissions" element={<PermissionsPage />} />
                    <Route path="models" element={<ModelsPage />} />
                    <Route path="errors" element={<ErrorsPage />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirecionamento padrão */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
      <ThemeToggle toggleColorMode={toggleColorMode} />
    </ThemeProvider>
  );
}

export default App;