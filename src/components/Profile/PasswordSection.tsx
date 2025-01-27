import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  Typography,
  Collapse
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordSectionProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  errors: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
  onChange: (field: string, value: string) => void;
  expanded: boolean;
}

export const PasswordSection: React.FC<PasswordSectionProps> = ({
  currentPassword,
  newPassword,
  confirmPassword,
  errors,
  onChange,
  expanded
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = (field: 'current' | 'new' | 'confirm') => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Collapse in={expanded}>
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Alterar Senha
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Senha Atual"
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => onChange('currentPassword', e.target.value)}
            error={Boolean(errors.currentPassword)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClickShowPassword('current')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errors.currentPassword && (
            <FormHelperText error>{errors.currentPassword}</FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Nova Senha"
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => onChange('newPassword', e.target.value)}
            error={Boolean(errors.newPassword)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClickShowPassword('new')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errors.newPassword && (
            <FormHelperText error>{errors.newPassword}</FormHelperText>
          )}
          <FormHelperText>
            A senha deve ter no mínimo 8 caracteres, incluir maiúsculas, minúsculas, números e caracteres especiais
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth>
          <TextField
            label="Confirmar Nova Senha"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            error={Boolean(errors.confirmPassword)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClickShowPassword('confirm')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errors.confirmPassword && (
            <FormHelperText error>{errors.confirmPassword}</FormHelperText>
          )}
        </FormControl>
      </Box>
    </Collapse>
  );
};