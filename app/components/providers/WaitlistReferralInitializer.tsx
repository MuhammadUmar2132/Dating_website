'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { setReferralCode } from '@/features/waitlist/waitlist.slice';
import { persistReferralCode, readReferralCode } from '@/lib/referral-storage';
import { useAppDispatch } from '@/store/hooks';

export function WaitlistReferralInitializer() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    // A ?ref= on the URL is the freshest signal, so it wins and is written
    // back to storage. Otherwise fall back to a code stored by an earlier
    // /link/{code} visit, which is what survives a page reload.
    const ref = searchParams.get('ref')?.trim();

    if (ref) {
      persistReferralCode(ref);
      dispatch(setReferralCode(ref));
      return;
    }

    const stored = readReferralCode();
    if (stored) {
      dispatch(setReferralCode(stored));
    }
  }, [dispatch, searchParams]);

  return null;
}
