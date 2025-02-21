// Path: pages\Zones\components\DeleteZoneDialog.tsx
import { ConfirmDialog } from '@/components/Feedback/ConfirmDialog';

interface DeleteZoneDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteZoneDialog: React.FC<DeleteZoneDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <ConfirmDialog
      open={open}
      title="Remover Zona"
      message="Tem certeza que deseja remover esta zona? Esta ação removerá todas as permissões associadas e não pode ser desfeita."
      confirmText="Remover"
      cancelText="Cancelar"
      onConfirm={onConfirm}
      onCancel={onClose}
    />
  );
};
