const PERSONAL_CHAT_SUFFIX = '@c.us';

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) {
    return `7${digits.slice(1)}`;
  }
  return digits;
}

export function isValidPhone(raw: string): boolean {
  return /^[1-9]\d{9,14}$/.test(normalizePhone(raw));
}

export function phoneToChatId(raw: string): string {
  return `${normalizePhone(raw)}${PERSONAL_CHAT_SUFFIX}`;
}

export function chatIdToPhone(chatId: string): string {
  return chatId.split('@')[0] ?? chatId;
}

export function formatPhone(raw: string): string {
  const digits = normalizePhone(raw);
  const ru = /^7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(digits);
  if (ru) {
    return `+7 ${ru[1]} ${ru[2]}-${ru[3]}-${ru[4]}`;
  }
  return `+${digits}`;
}
