// Path: components\Profile\ProfileDialog.tsx
import { AccountCircle, Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';

import React from 'react';

import { useAuth } from '@/hooks/useAuth';

import { ProfileForm } from './ProfileForm';

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({
  open,
  onClose,
}) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { position: 'relative' },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <AccountCircle color="primary" />
            <Box>
              <Typography variant="h6">Meu Perfil</Typography>
              <Typography variant="caption" color="text.secondary">
                {user.username}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Gerencie suas informações pessoais e configurações de segurança
          </Typography>
        </Box>

        <ProfileForm onSuccess={onClose} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};
