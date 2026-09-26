import { createApi } from '@reduxjs/toolkit/query/react';

import { RECEIVE_TIMEOUT_SEC } from '@/shared/config';

import { greenApiBaseQuery } from './base-query';
import type {
  DeleteNotificationResponse,
  GetStateInstanceResponse,
  GreenApiCredentials,
  GreenApiNotification,
  SendMessageRequest,
  SendMessageResponse,
} from './types';

export const greenApi = createApi({
  reducerPath: 'greenApi',
  baseQuery: greenApiBaseQuery,
  endpoints: (build) => ({
    getStateInstance: build.query<GetStateInstanceResponse, GreenApiCredentials | void>({
      query: (credentials) => ({
        method: 'getStateInstance',
        credentials: credentials ?? undefined,
      }),
      keepUnusedDataFor: 0,
    }),

    sendMessage: build.mutation<SendMessageResponse, SendMessageRequest>({
      query: (body) => ({ method: 'sendMessage', httpMethod: 'POST', body }),
    }),

    receiveNotification: build.mutation<GreenApiNotification | null, void>({
      query: () => ({
        method: 'receiveNotification',
        params: { receiveTimeout: RECEIVE_TIMEOUT_SEC },
      }),
    }),

    deleteNotification: build.mutation<DeleteNotificationResponse, number>({
      query: (receiptId) => ({
        method: 'deleteNotification',
        httpMethod: 'DELETE',
        pathParam: receiptId,
      }),
    }),
  }),
});

export const { useLazyGetStateInstanceQuery, useSendMessageMutation } = greenApi;
