'use client';

import { cacheExchange, Client, fetchExchange, Provider } from 'urql';

export default function UrqlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = new Client({
    url: 'http://localhost:4000/graphql',
    exchanges: [cacheExchange, fetchExchange],
  });

  return <Provider value={client}>{children}</Provider>;
}
