// Path: components\Profile\ProfileButton.tsx
import { AccountCircle } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import React, { useState } from 'react';

import { ProfileDialog } from './ProfileDialog';

export const ProfileButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="Perfil">
        <IconButton color="inherit" onClick={handleOpen} sx={{ mr: 1 }}>
          <AccountCircle />
        </IconButton>
      </Tooltip>

      <ProfileDialog open={open} onClose={handleClose} />
    </>
  );
};
