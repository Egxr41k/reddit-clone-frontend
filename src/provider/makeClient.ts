import { ssrExchange, fetchExchange, createClient } from '@urql/next';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../graphql/generated/server';

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query,
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

function cofigureCache() {
  return cacheExchange({
    updates: {
      Mutation: {
        logout: (_result, _args, cache, _info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            () => ({ me: null }),
          );
        },
        login: (_result, _args, cache, _info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            (result, query) => {
              if (result.login.errors) return query;
              return { me: result.login.user };
            },
          );
        },
        register: (_result, _args, cache, _info) => {
          betterUpdateQuery<RegisterMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            (result, query) => {
              if (result.register.errors) return query;
              return { me: result.register.user };
            },
          );
        },
      },
    },
  });
}

export function makeClient() {
  const ssr = ssrExchange({
    isClient: typeof window !== 'undefined',
  });

  const cache = cofigureCache();

  const client = createClient({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    },
    exchanges: [cache, ssr, fetchExchange],
  });

  return { client, ssr };
}
