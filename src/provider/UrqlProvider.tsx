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
    fetchOptions: {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });

  return <Provider value={client}>{children}</Provider>;
}
