import { Box } from '@mui/material';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import montanhas from '@/assets/images/satellite/montanhas.png';
import rio from '@/assets/images/satellite/rio.png';
import brasilia from '@/assets/images/satellite/brasilia.png';
import santos from '@/assets/images/satellite/santos.png';
import amazonia from '@/assets/images/satellite/amazonia.png';
import luiz_eduardo from '@/assets/images/satellite/luiz_eduardo.png';
import uruguaiana from '@/assets/images/satellite/uruguaiana.png';

const SATELLITE_IMAGES = [
  montanhas,
  rio,
  brasilia,
  santos,
  amazonia,
  luiz_eduardo,
  uruguaiana
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
    autoplaySpeed: 5000,
    pauseOnHover: false,
    arrows: false
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Slider {...settings}>
        {SATELLITE_IMAGES.map((image, index) => (
          <Box key={index} sx={{ height: '100vh' }}>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          </Box>
        ))}
      </Slider>
      
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 2
        }}
      />
    </Box>
  );
};