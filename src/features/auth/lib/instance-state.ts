import type { InstanceState } from '@/shared/api/green-api';

export const USABLE_STATES: ReadonlySet<InstanceState> = new Set(['authorized', 'yellowCard']);

export const INSTANCE_STATE_MESSAGES: Record<InstanceState, string> = {
  authorized: 'Инстанс авторизован',
  notAuthorized: 'Инстанс не привязан к аккаунту: отсканируйте QR-код в личном кабинете GREEN-API',
  blocked: 'Аккаунт заблокирован',
  sleepMode: 'Инстанс в спящем режиме: телефон не в сети',
  starting: 'Инстанс запускается, попробуйте через минуту',
  yellowCard: 'Отправка сообщений частично ограничена из-за подозрения на спам',
};
