import React from 'react';
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
  Alert,
  Box
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const UserForm = ({ open, onClose, user, onSubmit }) => {
  const { 
    control, 
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      role: user?.role || 'user',
      password: '',
      confirmPassword: ''
    }
  });

  // Reset form quando o usuário mudar
  React.useEffect(() => {
    reset({
      username: user?.username || '',
      email: user?.email || '',
      role: user?.role || 'user',
      password: '',
      confirmPassword: ''
    });
  }, [user, reset]);

  const onSubmitForm = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      // Remover confirmPassword e senha vazia
      const submitData = { ...data };
      delete submitData.confirmPassword;
      if (!submitData.password) {
        delete submitData.password;
      }

      await onSubmit(user?.id, submitData);
      onClose();
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {user ? 'Editar Usuário' : 'Novo Usuário'}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="username"
              control={control}
              rules={{ 
                required: 'Username é obrigatório',
                minLength: {
                  value: 3,
                  message: 'Username deve ter no mínimo 3 caracteres'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  disabled={!!user}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{ 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              rules={{ required: 'Perfil é obrigatório' }}
              render={({ field }) => (
                <FormControl error={!!errors.role}>
                  <InputLabel>Perfil</InputLabel>
                  <Select {...field} label="Perfil">
                    <MenuItem value="user">Usuário</MenuItem>
                    <MenuItem value="admin">Administrador</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={!user ? {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 8,
                  message: 'Senha deve ter no mínimo 8 caracteres'
                }
              } : {}}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Senha"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={!user ? {
                required: 'Confirmação de senha é obrigatória',
                validate: (value) =>
                  value === control._formValues.password || 'As senhas não coincidem'
              } : {}}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Confirmar Senha"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />
          </Box>

          {user && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Deixe os campos de senha em branco para manter a senha atual
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {user ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm;