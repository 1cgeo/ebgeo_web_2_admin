// Path: components\Profile\ProfileForm.tsx
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';

import React, { useState } from 'react';

import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';

import { api } from '@/services/api';
import type { User } from '@/types/users';

import { PasswordSection } from './PasswordSection';

interface ProfileFormData extends Record<string, string> {
  email: string;
  nome_completo: string;
  nome_guerra: string;
  organizacao_militar: string;
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
  nome_completo: string;
  nome_guerra: string;
  organizacao_militar: string;
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
    nome_completo: user?.nome_completo || '',
    nome_guerra: user?.nome_guerra || '',
    organizacao_militar: user?.organizacao_militar || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const validateForm = (values: ProfileFormData) => {
    const errors: Partial<ProfileFormData> = {};

    if (!values.email) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Email inválido';
    }

    if (values.nome_completo && values.nome_completo.length > 255) {
      errors.nome_completo = 'Nome completo deve ter no máximo 255 caracteres';
    }

    if (values.nome_guerra && values.nome_guerra.length > 50) {
      errors.nome_guerra = 'Nome de guerra deve ter no máximo 50 caracteres';
    }

    if (values.organizacao_militar && values.organizacao_militar.length > 255) {
      errors.organizacao_militar =
        'Organização militar deve ter no máximo 255 caracteres';
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
        errors.newPassword =
          'A senha deve conter pelo menos uma letra minúscula';
      } else if (!/(?=.*[A-Z])/.test(values.newPassword)) {
        errors.newPassword =
          'A senha deve conter pelo menos uma letra maiúscula';
      } else if (!/(?=.*\d)/.test(values.newPassword)) {
        errors.newPassword = 'A senha deve conter pelo menos um número';
      } else if (!/(?=.*[@$!%*?&])/.test(values.newPassword)) {
        errors.newPassword =
          'A senha deve conter pelo menos um caractere especial';
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem';
      }
    }

    return errors;
  };

  const { values, errors, isSubmitting, handleChange, setErrors } =
    useForm<ProfileFormData>({
      initialValues,
      validate: validateForm,
      onSubmit: async () => {}, // We'll handle submit manually
    });

  const handleFieldChange = (field: string, value: string) => {
    const syntheticEvent = {
      target: {
        name: field,
        value,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(syntheticEvent);
  };

  const { execute: updateProfile } = useApi<UpdateProfileResponse>({
    onSuccess: data => {
      enqueueSnackbar('Perfil atualizado com sucesso', { variant: 'success' });
      if (user) {
        const { token, ...userData } = data;
        login(userData as User, token);
      }
      onSuccess();
    },
    onError: error => {
      setSubmitError(error.message);
    },
  });

  const { execute: updatePassword } = useApi<UpdatePasswordResponse>({
    onSuccess: () => {
      enqueueSnackbar('Senha atualizada com sucesso', { variant: 'success' });
    },
    onError: error => {
      setSubmitError(error.message);
    },
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
      // Update profile data
      await updateProfile(() =>
        api
          .put('/api/users/me', {
            email: values.email,
            nome_completo: values.nome_completo || undefined,
            nome_guerra: values.nome_guerra || undefined,
            organizacao_militar: values.organizacao_militar || undefined,
          })
          .then(response => response.data),
      );

      // Update password if needed
      if (changePassword && user?.id) {
        await updatePassword(() =>
          api
            .put(`/api/users/${user.id}/password`, {
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
            })
            .then(response => response.data),
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

      <Typography variant="subtitle2" gutterBottom>
        Informações Básicas
      </Typography>

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

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle2" gutterBottom>
        Dados Pessoais
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Nome Completo"
        name="nome_completo"
        value={values.nome_completo}
        onChange={handleChange}
        error={Boolean(errors.nome_completo)}
        helperText={errors.nome_completo}
        disabled={isSubmitting}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Nome de Guerra"
        name="nome_guerra"
        value={values.nome_guerra}
        onChange={handleChange}
        error={Boolean(errors.nome_guerra)}
        helperText={errors.nome_guerra}
        disabled={isSubmitting}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Organização Militar"
        name="organizacao_militar"
        value={values.organizacao_militar}
        onChange={handleChange}
        error={Boolean(errors.organizacao_militar)}
        helperText={errors.organizacao_militar}
        disabled={isSubmitting}
      />

      <Divider sx={{ my: 3 }} />

      <FormControlLabel
        control={
          <Switch
            checked={changePassword}
            onChange={e => setChangePassword(e.target.checked)}
            disabled={isSubmitting}
          />
        }
        label="Alterar senha"
      />

      <PasswordSection
        currentPassword={values.currentPassword}
        newPassword={values.newPassword}
        confirmPassword={values.confirmPassword}
        errors={{
          currentPassword: errors.currentPassword,
          newPassword: errors.newPassword,
          confirmPassword: errors.confirmPassword,
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
