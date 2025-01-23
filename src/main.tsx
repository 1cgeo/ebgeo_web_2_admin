import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './index.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { GlobalProvider } from '@/context/GlobalContext';
import { SnackbarProvider } from 'notistack';
import { CssBaseline } from '@mui/material';
import { PageLoader } from '@/components/Feedback/PageLoader';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <GlobalProvider>
          <SnackbarProvider 
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <CssBaseline />
            <PageLoader />
            <RouterProvider router={router} />
          </SnackbarProvider>
        </GlobalProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);