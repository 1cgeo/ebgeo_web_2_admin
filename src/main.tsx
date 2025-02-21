// Path: main.tsx
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { SnackbarProvider } from 'notistack';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { ErrorBoundary } from '@/components/Feedback/ErrorBoundary';
import { PageLoader } from '@/components/Feedback/PageLoader';

import { AuthProvider } from '@/context/AuthContext';
import { GlobalProvider } from '@/context/GlobalContext';
import { ThemeProvider } from '@/context/ThemeContext';

import './index.css';
import { router } from './routes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
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
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
                localeText={{
                  cancelButtonLabel: 'Cancelar',
                  clearButtonLabel: 'Limpar',
                  okButtonLabel: 'OK',
                  todayButtonLabel: 'Hoje',
                }}
              >
                <CssBaseline />
                <PageLoader />
                <RouterProvider router={router} />
              </LocalizationProvider>
            </SnackbarProvider>
          </GlobalProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
