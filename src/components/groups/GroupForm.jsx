import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const GroupForm = ({ open, onClose, group, onSubmit }) => {
  const { 
    control, 
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: group?.name || '',
      description: group?.description || ''
    }
  });

  // Reset form quando o grupo mudar
  React.useEffect(() => {
    reset({
      name: group?.name || '',
      description: group?.description || ''
    });
  }, [group, reset]);

  const onSubmitForm = async (data) => {
    try {
      await onSubmit(group?.id, data);
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
        {group ? 'Editar Grupo' : 'Novo Grupo'}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ 
                required: 'Nome é obrigatório',
                minLength: {
                  value: 3,
                  message: 'Nome deve ter no mínimo 3 caracteres'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome do Grupo"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  autoFocus
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ maxLength: {
                value: 500,
                message: 'Descrição deve ter no máximo 500 caracteres'
              }}}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descrição"
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {group ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GroupForm;