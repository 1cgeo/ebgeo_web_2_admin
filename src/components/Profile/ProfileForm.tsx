import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useSnackbar } from 'notistack';
import { PasswordSection } from './PasswordSection';
import { useForm } from '@/hooks/useForm';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { User } from '@/types/users';

interface ProfileFormData extends Record<string, string> {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileFormProps {
  onSuccess: () => void;
}

// API Response Types
interface UpdateProfileResponse {
  email: string;
  id: string;
  username: string;
  role: 'admin' | 'user';
  token: string;
}

interface UpdatePasswordResponse {
  message: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess }) => {
  const { user, login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [changePassword, setChangePassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialValues: ProfileFormData = {
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  const validateForm = (values: ProfileFormData) => {
    const errors: Partial<ProfileFormData> = {};

    if (!values.email) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Email inválido';
    }

    if (changePassword) {
      if (!values.currentPassword) {
        errors.currentPassword = 'Senha atual é obrigatória';
      }

      if (!values.newPassword) {
        errors.newPassword = 'Nova senha é obrigatória';
      } else if (values.newPassword.length < 8) {
        errors.newPassword = 'A senha deve ter no mínimo 8 caracteres';
      } else if (!/(?=.*[a-z])/.test(values.newPassword)) {
        errors.newPassword = 'A senha deve conter pelo menos uma letra minúscula';
      } else if (!/(?=.*[A-Z])/.test(values.newPassword)) {
        errors.newPassword = 'A senha deve conter pelo menos uma letra maiúscula';
      } else if (!/(?=.*\d)/.test(values.newPassword)) {
        errors.newPassword = 'A senha deve conter pelo menos um número';
      } else if (!/(?=.*[@$!%*?&])/.test(values.newPassword)) {
        errors.newPassword = 'A senha deve conter pelo menos um caractere especial';
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem';
      }
    }

    return errors;
  };

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    setErrors
  } = useForm<ProfileFormData>({
    initialValues,
    validate: validateForm,
    onSubmit: async () => {} // We'll handle submit manually
  });

  const handleFieldChange = (field: string, value: string) => {
    const syntheticEvent = {
      target: {
        name: field,
        value: value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(syntheticEvent);
  };

  const { execute: updateProfile } = useApi<UpdateProfileResponse>({
    onSuccess: (data) => {
      enqueueSnackbar('Perfil atualizado com sucesso', { variant: 'success' });
      if (user) {
        const { token, ...userData } = data;
        login(userData as User, token);
      }
      onSuccess();
    },
    onError: (error) => {
      setSubmitError(error.message);
    }
  });

  const { execute: updatePassword } = useApi<UpdatePasswordResponse>({
    onSuccess: () => {
      enqueueSnackbar('Senha atualizada com sucesso', { variant: 'success' });
    },
    onError: (error) => {
      setSubmitError(error.message);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Update email
      await updateProfile(() => 
        api.put('/api/users/me', {
          email: values.email
        }).then(response => response.data)
      );

      // Update password if needed
      if (changePassword && user?.id) {
        await updatePassword(() =>
          api.put(`/api/users/${user.id}/password`, {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword
          }).then(response => response.data)
        );
      }
    } catch {
      // Error is handled by useApi hook
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <TextField
        fullWidth
        required
        margin="normal"
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        error={Boolean(errors.email)}
        helperText={errors.email}
        disabled={isSubmitting}
      />

      <FormControlLabel
        control={
          <Switch
            checked={changePassword}
            onChange={(e) => setChangePassword(e.target.checked)}
            disabled={isSubmitting}
          />
        }
        label="Alterar senha"
        sx={{ my: 1 }}
      />

      <PasswordSection
        currentPassword={values.currentPassword}
        newPassword={values.newPassword}
        confirmPassword={values.confirmPassword}
        errors={{
          currentPassword: errors.currentPassword,
          newPassword: errors.newPassword,
          confirmPassword: errors.confirmPassword
        }}
        onChange={handleFieldChange}
        expanded={changePassword}
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </Box>
    </Box>
  );
};