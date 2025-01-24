import { useState, useEffect, useCallback } from 'react';
import { Box, useTheme } from '@mui/material';

const SATELLITE_IMAGES = [
  '/images/satellite/rio.jpg',
  '/images/satellite/brasilia.jpg',
  '/images/satellite/santos.jpg',
  '/images/satellite/amazonia.jpg',
  '/images/satellite/montanhas.jpg'
];

const TRANSITION_DURATION = 1000;
const SLIDE_DURATION = 5000;

export const BackgroundSlider = () => {
  const theme = useTheme();
  const [preloaded, setPreloaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isDarkMode = theme.palette.mode === 'dark';

  const preloadImages = useCallback(() => {
    const loadPromises = SATELLITE_IMAGES.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    });

    Promise.all(loadPromises)
      .then(() => setPreloaded(true))
      .catch(error => console.error('Error preloading images:', error));
  }, []);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  useEffect(() => {
    if (!preloaded) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % SATELLITE_IMAGES.length);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [nextIndex, preloaded]);

  if (!preloaded) return null;

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${SATELLITE_IMAGES[currentIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
          opacity: isTransitioning ? 0 : 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${SATELLITE_IMAGES[nextIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
          opacity: isTransitioning ? 1 : 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.4)',
        }}
      />
    </>
  );
};