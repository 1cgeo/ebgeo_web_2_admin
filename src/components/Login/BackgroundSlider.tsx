// Path: components\Login\BackgroundSlider.tsx
import { Box } from '@mui/material';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import Slider from 'react-slick';

const SATELLITE_IMAGES = [
  '/images/satellite/montanhas.png',
  '/images/satellite/rio.png',
  '/images/satellite/brasilia.png',
  '/images/satellite/santos.png',
  '/images/satellite/amazonia.png',
  '/images/satellite/luiz_eduardo.png',
  '/images/satellite/uruguaiana.png',
];

export const BackgroundSlider = () => {
  const settings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    pauseOnHover: false,
    arrows: false,
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Slider {...settings}>
        {SATELLITE_IMAGES.map((image, index) => (
          <Box key={index} sx={{ height: '100vh' }}>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </Box>
        ))}
      </Slider>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          zIndex: 2,
        }}
      />
    </Box>
  );
};
