import type { KeyboardEvent } from 'react';

export function submitOnEnter(submit: () => unknown) {
  return (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }
    event.preventDefault();
    void submit();
  };
}
