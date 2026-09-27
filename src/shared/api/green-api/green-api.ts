import { createApi } from '@reduxjs/toolkit/query/react';

import {
  RECEIVE_REQUEST_TIMEOUT_MS,
  RECEIVE_TIMEOUT_SEC,
  SEND_REQUEST_TIMEOUT_MS,
} from '@/shared/config';

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
      query: (body) => ({
        method: 'sendMessage',
        httpMethod: 'POST',
        body,
        timeout: SEND_REQUEST_TIMEOUT_MS,
      }),
    }),

    receiveNotification: build.mutation<GreenApiNotification | null, void>({
      query: () => ({
        method: 'receiveNotification',
        params: { receiveTimeout: RECEIVE_TIMEOUT_SEC },
        timeout: RECEIVE_REQUEST_TIMEOUT_MS,
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
