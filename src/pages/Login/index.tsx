import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material';

// Imagens a serem preloaded
const satelliteImages = [
  '/images/satellite/rio.jpg',
  '/images/satellite/brasilia.jpg',
  '/images/satellite/santos.jpg',
  '/images/satellite/amazonia.jpg',
  '/images/satellite/montanhas.jpg'
];

// Função de preload de imagens
const preloadImages = (urls: string[]) => {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

const BackgroundSlider = () => {
  // Preload images on component mount
  useEffect(() => {
    preloadImages(satelliteImages);
  }, []);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setNextImageIndex((nextImageIndex + 1) % satelliteImages.length);
        setIsTransitioning(false);
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, [nextImageIndex]);

  return (
    <>
      <Box
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${satelliteImages[currentImageIndex]})`,
          opacity: isTransitioning ? 0 : 1,
        }}
      />
      <Box
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${satelliteImages[nextImageIndex]})`,
          opacity: isTransitioning ? 1 : 0,
        }}
      />
      <Box className="absolute inset-0 bg-black/40" /> {/* Overlay escuro */}
    </>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/dashboard');
    } catch {
      setError('Credenciais inválidas. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-md">
      <CardContent className="p-8">
        <Box component="form" onSubmit={handleSubmit} className="space-y-6">
          <Box className="text-center mb-8">
            <Box className="flex justify-center mb-6">
            <img
              src="/images/logo-ebgeo-white.png"
              alt="EBGeo Logo"
              className="h-16 w-auto"
            />
          </Box>
          <Typography variant="h5" component="h1" className="text-white font-bold mb-2">
            Sistema de Administração
          </Typography>
          <Typography variant="body2" className="text-white/80">
            Acesso Restrito
          </Typography>
          </Box>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            required
            name="username"
            label="Usuário"
            variant="outlined"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
            className="bg-white/5 rounded-lg"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
            }}
          />

          <TextField
            fullWidth
            required
            name="password"
            type="password"
            label="Senha"
            variant="outlined"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className="bg-white/5 rounded-lg"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            className="mt-6 bg-blue-600 hover:bg-blue-700 py-3"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const LoginPage = () => {
  return (
    <Box className="relative min-h-screen flex items-center justify-center p-4">
      <BackgroundSlider />
      <LoginForm />
    </Box>
  );
};

export default LoginPage;