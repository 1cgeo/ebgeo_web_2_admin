import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Alert, Typography, useTheme, Fade } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { authService, NetworkError } from '@/services/auth';
import { CSPError } from '@/services/api';
import { useForm } from '@/hooks/useForm';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { LoadingDot } from '@/components/Animations/LoadingDot';
import { PageTransition } from '@/components/Animations/PageTransition';
import type { AxiosError } from 'axios';

type LoginFormFields = {
  username: string;
  password: string;
  submit: string;
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
  AUTH: 'Usuário ou senha inválidos',
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
    onSubmit: async () => {
      // Empty because we're handling submit manually
    }
  });

      const validateForm = () => {
      const errors: Partial<LoginFormFields> = {};
      
      if (!values.username) {
        errors.username = 'Usuário é obrigatório';
      } else if (values.username.length < 3) {
        errors.username = 'Usuário deve ter no mínimo 3 caracteres';
      } else if (values.username.length > 50) {
        errors.username = 'Usuário deve ter no máximo 50 caracteres';
      } else if (!/^[a-zA-Z0-9._]+$/.test(values.username)) {
        errors.username = 'Usuário deve conter apenas letras, números, pontos e underlines';
      } else if (values.username.trim() !== values.username) {
        errors.username = 'Usuário não pode começar ou terminar com espaços';
      }

      if (!values.password) {
        errors.password = 'Senha é obrigatória';
      } else if (values.password.length < 6) {
        errors.password = 'Senha deve ter no mínimo 6 caracteres';
      } else if (values.password.length > 50) {
        errors.password = 'Senha deve ter no máximo 50 caracteres';
      }

      return errors;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      buttonPressVibration();
      
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        errorVibration();
        return;
      }
      
      setErrors({});
    
    try {
      const response = await authService.login({
        username: values.username,
        password: values.password
      });
      
      if (response.user.role !== 'admin') {
        errorVibration();
        setErrors({ submit: 'Acesso restrito a administradores' });
        return;
      }
      
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
          setErrors({ submit: errorMessages.AUTH });
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
          border: '1px solid rgba(0, 0, 0, 0.5)',
          borderRadius: 2
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
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

export default LoginForm;