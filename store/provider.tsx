'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

import {
  makeStore,
  rehydrateWaitlistForm,
  type AppStore,
  type RootState,
} from '@/store';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  const serverStateRef = useRef<RootState | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    /* Frozen empty snapshot so useSelector matches SSR HTML even if the
       layout rehydrates sessionStorage before the page segment hydrates. */
    serverStateRef.current = storeRef.current.getState();
  }

  useEffect(() => {
    rehydrateWaitlistForm(storeRef.current!);
  }, []);

  return (
    <Provider store={storeRef.current} serverState={serverStateRef.current!}>
      {children}
    </Provider>
  );
}
