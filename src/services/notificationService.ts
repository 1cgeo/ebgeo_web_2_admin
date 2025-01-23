import { enqueueSnackbar, VariantType } from 'notistack';

export const notificationService = {
  success(message: string) {
    this.show(message, 'success');
  },

  error(message: string) {
    this.show(message, 'error');
  },

  warning(message: string) {
    this.show(message, 'warning');
  },

  info(message: string) {
    this.show(message, 'info');
  },

  show(message: string, variant: VariantType) {
    enqueueSnackbar(message, {
      variant,
      autoHideDuration: variant === 'error' ? 5000 : 3000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
  }
};