import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  LockOutlined 
} from '@mui/icons-material';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpa erro ao digitar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include' // Para suportar cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      if (data.user.role !== 'admin') {
        throw new Error('Acesso restrito a administradores');
      }

      // Salvar token se necessário (caso não use cookies)
      // localStorage.setItem('token', data.token);

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900"
      sx={{ p: 3 }}
    >
      <Paper 
        elevation={4}
        className="w-full max-w-md p-8 space-y-6"
      >
        <Box className="text-center">
          <LockOutlined 
            className="mx-auto mb-4 h-12 w-12 text-blue-600"
            sx={{ fontSize: 40 }}
          />
          <Typography 
            variant="h5" 
            component="h1"
            className="mb-2 font-bold"
          >
            EBGeo Admin
          </Typography>
          <Typography 
            variant="body2" 
            color="textSecondary"
          >
            Painel Administrativo
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mt-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Usuário"
            name="username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Senha"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={loading}
            className="mt-6"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;