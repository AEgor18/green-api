'use client';

import { useEffect, useRef } from 'react';

export function useScrollToBottom<T extends HTMLElement>(trigger: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    ref.current?.scrollIntoView?.({ block: 'end' });
  }, [trigger]);

  return ref;
}
