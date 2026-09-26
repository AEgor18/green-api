import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export function getErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    switch (error.status) {
      case 401:
      case 403:
        return 'Неверный idInstance или apiTokenInstance';
      case 400:
        return 'Некорректный запрос к GREEN-API';
      case 429:
        return 'Слишком много запросов, попробуйте позже';
      case 466:
        return 'Исчерпан лимит тарифа GREEN-API';
      case 'FETCH_ERROR':
        return 'Нет соединения с GREEN-API. Проверьте apiUrl и интернет';
      case 'TIMEOUT_ERROR':
        return 'GREEN-API не ответил вовремя';
      case 'PARSING_ERROR':
        return 'Не удалось разобрать ответ GREEN-API';
      case 'CUSTOM_ERROR':
        return error.error;
      default:
        return typeof error.status === 'number' && error.status >= 500
          ? 'Сервер GREEN-API временно недоступен'
          : `Ошибка GREEN-API (${String(error.status)})`;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Неизвестная ошибка';
}
