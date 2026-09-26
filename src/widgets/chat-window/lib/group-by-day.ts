import type { ChatMessage } from '@/entities/chat';

export interface DayGroup {
  key: string;
  label: string;
  messages: ChatMessage[];
}

const dayFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });
const dayWithYearFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function startOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function formatDayLabel(timestamp: number, now: number = Date.now()): string {
  const diffDays = Math.round((startOfDay(now) - startOfDay(timestamp)) / 86_400_000);
  if (diffDays === 0) {
    return 'Сегодня';
  }
  if (diffDays === 1) {
    return 'Вчера';
  }
  const sameYear = new Date(timestamp).getFullYear() === new Date(now).getFullYear();
  return (sameYear ? dayFormatter : dayWithYearFormatter).format(timestamp);
}

export function groupMessagesByDay(messages: ChatMessage[], now: number = Date.now()): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const message of messages) {
    const key = String(startOfDay(message.timestamp));
    const current = groups.at(-1);
    if (current?.key === key) {
      current.messages.push(message);
    } else {
      groups.push({ key, label: formatDayLabel(message.timestamp, now), messages: [message] });
    }
  }
  return groups;
}
