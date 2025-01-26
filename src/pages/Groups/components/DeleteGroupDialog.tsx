import { ConfirmDialog } from '@/components/Feedback/ConfirmDialog';

interface DeleteGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteGroupDialog: React.FC<DeleteGroupDialogProps> = ({
  open,
  onClose,
  onConfirm
}) => {
  return (
    <ConfirmDialog
      open={open}
      title="Remover Grupo"
      message="Tem certeza que deseja remover este grupo? Esta ação não pode ser desfeita."
      confirmText="Remover"
      cancelText="Cancelar"
      onConfirm={onConfirm}
      onCancel={onClose}
    />
  );
};