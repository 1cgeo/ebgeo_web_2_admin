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

import { AuthProvider } from '@/providers/AuthProvider';
import { GlobalProvider } from '@/providers/GlobalProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

import './index.css';
import { router } from './routes';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
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
