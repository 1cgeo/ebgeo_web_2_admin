// src/pages/Users/components/UserDialog.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  InputAdornment
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { groupsService } from '@/services/groups';
import { usersService } from '@/services/users';
import type { FormData } from '@/types/users';
import type { GroupDetails } from '@/types/groups';

interface UserDialogProps {
  open: boolean;
  userId: string | null;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

type FormDataWithOptionalPassword = Omit<FormData, 'password' | 'confirmPassword'> & {
  password?: string;
  confirmPassword?: string;
};

const initialFormData: FormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  groupIds: []
};

export const UserDialog: React.FC<UserDialogProps> = ({
  open,
  userId,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<GroupDetails[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchGroups = async () => {
    try {
      const response = await groupsService.list({});
      setGroups(response.groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchUserDetails = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const user = await usersService.getDetails(userId);
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        confirmPassword: '',
        role: user.role,
        groupIds: user.groups.map(group => group.id)
      });
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (open) {
      fetchGroups();
      if (userId) {
        fetchUserDetails();
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [open, userId, fetchUserDetails]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username deve ter no mínimo 3 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!userId) { // Validar senha apenas na criação
      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não conferem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    let submitData: FormDataWithOptionalPassword = { ...formData };
    
    // Se for edição e não houver senha, remover campos de senha
    if (userId && !submitData.password) {
      const { password: _password, confirmPassword: _confirmPassword, ...rest } = submitData;
      submitData = rest;
    }

    await onSubmit(submitData as FormData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleChange = (event: SelectChangeEvent<'admin' | 'user'>) => {
    setFormData(prev => ({ ...prev, role: event.target.value as 'admin' | 'user' }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit
      }}
    >
      <DialogTitle>
        {userId ? 'Editar Usuário' : 'Novo Usuário'}
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              fullWidth
              required
              disabled={!!userId}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Perfil</InputLabel>
              <Select
                value={formData.role}
                onChange={handleRoleChange}
                error={!!errors.role}
                label="Perfil"
              >
                <MenuItem value="user">Usuário</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
              {errors.role && (
                <FormHelperText error>{errors.role}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              multiple
              options={groups}
              getOptionLabel={(option) => option.name}
              value={groups.filter(group => formData.groupIds.includes(group.id))}
              onChange={(_, newValue) => {
                setFormData(prev => ({
                  ...prev,
                  groupIds: newValue.map(group => group.id)
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Grupos"
                  fullWidth
                />
              )}
            />
          </Grid>

          {(!userId || formData.password) && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="password"
                  label={userId ? "Nova Senha" : "Senha"}
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
                  required={!userId}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="confirmPassword"
                  label="Confirmar Senha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  fullWidth
                  required={!userId}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};