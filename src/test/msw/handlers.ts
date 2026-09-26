import { http, HttpResponse } from 'msw';

import { methodUrl } from './fixtures';

export const handlers = [
  http.get(methodUrl('getStateInstance'), () => HttpResponse.json({ stateInstance: 'authorized' })),
  http.post(methodUrl('sendMessage'), () => HttpResponse.json({ idMessage: 'OUT-1' })),
  http.get(methodUrl('receiveNotification'), () => HttpResponse.json(null)),
  http.delete(`${methodUrl('deleteNotification')}/:receiptId`, () =>
    HttpResponse.json({ result: true }),
  ),
];
