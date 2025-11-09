'use client';

import { UrqlProvider } from '@urql/next';
import React, { useMemo } from 'react';
import { makeClient } from './makeClient';

export default function UrqlProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { client, ssr } = useMemo(() => makeClient(), []);

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  );
}
