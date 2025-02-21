// Path: components\Animations\LoadingDot.tsx
import { Box, keyframes } from '@mui/material';

const pulse = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
`;

export const LoadingDot = () => (
  <Box
    sx={{
      display: 'flex',
      gap: 1,
      justifyContent: 'center',
      alignItems: 'center',
      my: 2,
      '& > span': {
        width: 8,
        height: 8,
        backgroundColor: 'primary.main',
        borderRadius: '50%',
        display: 'inline-block',
        animation: `${pulse} 1.4s infinite ease-in-out both`,
      },
      '& > span:nth-of-type(1)': {
        animationDelay: '-0.32s',
      },
      '& > span:nth-of-type(2)': {
        animationDelay: '-0.16s',
      },
    }}
  >
    <span />
    <span />
    <span />
  </Box>
);
