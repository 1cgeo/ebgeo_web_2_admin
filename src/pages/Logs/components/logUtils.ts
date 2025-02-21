// Path: pages\Logs\components\logUtils.ts
import type { PinoLevel } from '@/types/logs';

export function getLevelColor(
  level: PinoLevel,
): 'error' | 'warning' | 'info' | 'default' {
  switch (level) {
    case 50:
      return 'error'; // ERROR
    case 40:
      return 'warning'; // WARN
    case 30:
      return 'info'; // INFO
    default:
      return 'default'; // DEBUG/TRACE
  }
}

export function getLevelLabel(level: PinoLevel): string {
  switch (level) {
    case 50:
      return 'Erro';
    case 40:
      return 'Alerta';
    case 30:
      return 'Info';
    case 20:
      return 'Debug';
    default:
      return 'Desconhecido';
  }
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Data inválida';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';

    return date.toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
    });
  } catch {
    return 'Data inválida';
  }
}
