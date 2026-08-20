'use client';

import * as React from 'react';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { ConsentForm } from '@/components/auth/consent-form';


export default function Page(): React.JSX.Element {
  const [error, setError] = React.useState<string | null>(null);

  return (
    <Layout>
      <GuestGuard onError={setError}>
        <ConsentForm error1={error}/>
      </GuestGuard>
    </Layout>
  );
}
