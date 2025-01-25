import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Typography,
  useTheme,
  Fade
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { authService, NetworkError } from '@/services/auth';
import { CSPError } from '@/services/api';
import { useForm } from '@/hooks/useForm';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { LoadingDot } from '@/components/Animations/LoadingDot';
import { PageTransition } from '@/components/Animations/PageTransition';
import type { AxiosError } from 'axios';

type LoginFormFields = {
  [K in 'username' | 'password' | 'submit']: string;
}

interface ApiErrorResponse {
  message: string;
  details?: Record<string, string[]>;
}

const errorMessages: Record<string, string> = {
  TIMEOUT: 'Tempo de conexão esgotado. Verifique sua conexão e tente novamente.',
  DNS: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
  SSL: 'Erro de segurança na conexão. Verifique se a data/hora do seu sistema estão corretas.',
  NETWORK: 'Servidor temporariamente indisponível. Tente novamente em alguns instantes.',
  AUTH: 'Sua sessão expirou. Por favor, faça login novamente.',
  CSP: 'Erro de segurança detectado na página. Entre em contato com o suporte.',
  RATE_LIMIT: 'Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.',
  MAINTENANCE: 'Sistema em manutenção. Tente novamente mais tarde.',
  DEFAULT: 'Ocorreu um erro inesperado. Tente novamente.'
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login } = useAuth();
  const { buttonPressVibration, successVibration, errorVibration } = useHapticFeedback();
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const isDarkMode = theme.palette.mode === 'dark';

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    setErrors
  } = useForm<LoginFormFields>({
    initialValues: {
      username: '',
      password: '',
      submit: ''
    },
    onSubmit: async (formValues: LoginFormFields) => {
      buttonPressVibration();
      setErrors({});
      
      try {
        const response = await authService.login({
          username: formValues.username,
          password: formValues.password
        });
        successVibration();
        login(response.user, response.token);
        setLoginSuccess(true);
        setTimeout(() => navigate('/dashboard'), 500);
      } catch (error) {
        errorVibration();
        if (error instanceof NetworkError) {
          setErrors({ submit: errorMessages[error.code] });
        } else if (error instanceof CSPError) {
          setErrors({ submit: errorMessages.CSP });
        } else {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          
          if (axiosError.response?.status === 401) {
            setErrors({ submit: 'Usuário ou senha inválidos' });
          } else if (axiosError.response?.status === 429) {
            setErrors({ submit: errorMessages.RATE_LIMIT });
          } else if (axiosError.response?.data?.message) {
            setErrors({ submit: axiosError.response.data.message });
          } else {
            setErrors({ submit: errorMessages.DEFAULT });
          }
        }
      }
    },
    validate: (values) => {
      const errors: Partial<LoginFormFields> = {};
      if (!values.username) errors.username = 'Campo obrigatório';
      if (values.username && values.username.length < 3) {
        errors.username = 'Mínimo de 3 caracteres';
      }
      if (!values.password) errors.password = 'Campo obrigatório';
      if (values.password && values.password.length < 6) {
        errors.password = 'Mínimo de 6 caracteres';
      }
      return errors;
    }
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    buttonPressVibration();
    setErrors({});
    
    try {
      const response = await authService.login({
        username: values.username,
        password: values.password
      });
      console.log(response)
      successVibration();
      login(response.user, response.token);
      setLoginSuccess(true);
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (error) {
      console.log(error)
      errorVibration();
      if (error instanceof NetworkError) {
        setErrors({ submit: errorMessages[error.code] });
      } else if (error instanceof CSPError) {
        setErrors({ submit: errorMessages.CSP });
      } else {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        
        if (axiosError.response?.status === 401) {
          setErrors({ submit: 'Usuário ou senha inválidos' });
        } else if (axiosError.response?.status === 429) {
          setErrors({ submit: errorMessages.RATE_LIMIT });
        } else if (axiosError.response?.data?.message) {
          setErrors({ submit: axiosError.response.data.message });
        } else {
          setErrors({ submit: errorMessages.DEFAULT });
        }
      }
    }
  };

  return (
    <PageTransition loading={loginSuccess}>
      <Card 
        sx={{ 
          width: '100%',
          maxWidth: '400px',
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          transform: loginSuccess ? 'scale(0.95) translateY(-20px)' : 'none',
          opacity: loginSuccess ? 0 : 1,
          transition: theme => theme.transitions.create(
            ['opacity', 'transform', 'background-color'],
            { duration: theme.transitions.duration.standard }
          ),
          boxShadow: _ => `0 0 20px rgba(0,0,0,0.3), 
                              0 0 40px rgba(0,0,0,0.1), 
                              0 0 80px rgba(0,0,0,0.1)`,
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 2
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Fade in={true} timeout={800}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <img
                    src="/images/logo-ebgeo.png"
                    alt="EBGeo Logo"
                    style={{ height: 64, width: 'auto' }}
                  />
                </Box>
                <Typography variant="h5" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Sistema de Administração
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Acesso Restrito
                </Typography>
              </Box>
            </Fade>

            {errors.submit && (
              <Fade in={true}>
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errors.submit}
                </Alert>
              </Fade>
            )}

            <Fade in={true} timeout={1000}>
              <Box>
                <TextField
                  fullWidth
                  required
                  name="username"
                  label="Usuário"
                  variant="outlined"
                  autoComplete="username"
                  value={values.username}
                  onChange={handleChange}
                  error={Boolean(errors.username)}
                  helperText={errors.username}
                  disabled={isSubmitting}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  required
                  name="password"
                  type="password"
                  label="Senha"
                  variant="outlined"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  disabled={isSubmitting}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  sx={{ 
                    py: 1.5,
                    position: 'relative',
                    '&:active': {
                      transform: 'scale(0.98)'
                    }
                  }}
                >
                  {isSubmitting ? <LoadingDot /> : 'Entrar'}
                </Button>
              </Box>
            </Fade>
          </Box>
        </CardContent>
      </Card>
    </PageTransition>
  );
};