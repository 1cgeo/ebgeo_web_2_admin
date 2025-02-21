// Path: pages\Users\components\DeleteUserDialog.tsx
import React from 'react';

import { ConfirmDialog } from '@/components/Feedback/ConfirmDialog';

import type { UserDetails } from '@/types/users';

interface DeleteUserDialogProps {
  open: boolean;
  user: UserDetails | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  user,
  onClose,
  onConfirm,
}) => {
  if (!user) return null;

  const isActive = user.isActive;
  const isAdmin = user.role === 'admin';

  return (
    <ConfirmDialog
      open={open}
      title={isActive ? 'Desativar Usuário' : 'Ativar Usuário'}
      message={
        isAdmin
          ? `Tem certeza que deseja ${isActive ? 'desativar' : 'ativar'} o administrador "${user.username}"? ${
              isActive
                ? 'Ele perderá acesso ao sistema.'
                : 'Ele voltará a ter acesso ao sistema.'
            }`
          : `Tem certeza que deseja ${isActive ? 'desativar' : 'ativar'} o usuário "${user.username}"? ${
              isActive
                ? 'Ele perderá acesso ao sistema.'
                : 'Ele voltará a ter acesso ao sistema.'
            }`
      }
      confirmText={isActive ? 'Desativar' : 'Ativar'}
      cancelText="Cancelar"
      onConfirm={onConfirm}
      onCancel={onClose}
    />
  );
};
