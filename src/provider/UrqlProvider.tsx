'use client';

import { Client, fetchExchange, Mutation, Provider } from 'urql';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../generated/graphql';

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query,
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

export default function UrqlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = new Client({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    exchanges: [
      cacheExchange({
        updates: {
          Mutation: {
            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return {
                      me: result.login.user,
                    };
                  }
                },
              );
            },
            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else {
                    return {
                      me: result.register.user,
                    };
                  }
                },
              );
            },
          },
        },
      }),
      fetchExchange,
    ],
  });

  return <Provider value={client}>{children}</Provider>;
}
