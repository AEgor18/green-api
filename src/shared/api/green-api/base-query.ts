import type { BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

import { REQUEST_TIMEOUT_MS } from '@/shared/config';

import type { GreenApiCredentials } from './types';

export interface GreenApiRequest {
  method: string;
  httpMethod?: 'GET' | 'POST' | 'DELETE';
  pathParam?: string | number;
  params?: Record<string, string | number>;
  body?: unknown;
  credentials?: GreenApiCredentials;
  timeout?: number;
}

interface StateWithSession {
  session?: { credentials: GreenApiCredentials | null };
}

export function buildMethodUrl(
  { apiUrl, idInstance, apiTokenInstance }: GreenApiCredentials,
  method: string,
  pathParam?: string | number,
): string {
  const base = apiUrl.replace(/\/+$/, '');
  const suffix = pathParam === undefined ? '' : `/${encodeURIComponent(pathParam)}`;
  return `${base}/waInstance${idInstance}/${method}/${apiTokenInstance}${suffix}`;
}

const rawBaseQuery = fetchBaseQuery();

export const greenApiBaseQuery: BaseQueryFn<GreenApiRequest, unknown, FetchBaseQueryError> = (
  {
    method,
    httpMethod = 'GET',
    pathParam,
    params,
    body,
    credentials,
    timeout = REQUEST_TIMEOUT_MS,
  },
  api,
  extraOptions,
) => {
  const resolved = credentials ?? (api.getState() as StateWithSession).session?.credentials;
  if (!resolved) {
    return { error: { status: 'CUSTOM_ERROR', error: 'Не выполнен вход в инстанс' } };
  }

  return rawBaseQuery(
    {
      url: buildMethodUrl(resolved, method, pathParam),
      method: httpMethod,
      params,
      body,
      timeout,
    },
    api,
    extraOptions,
  );
};
