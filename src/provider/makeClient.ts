import { Cache, cacheExchange, QueryInput } from '@urql/exchange-graphcache';
import { createClient, fetchExchange, ssrExchange } from '@urql/next';
import { Exchange, OperationResult } from 'urql';
import { pipe, tap } from 'wonka';
import {
  ChangePasswordMutation,
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../graphql/generated/server';

export const errorExchange: Exchange = ({ forward }) => {
  return (ops$) =>
    pipe(
      forward(ops$),
      tap((result: OperationResult) => {
        if (result.error) {
          const err = result.error;

          if (err.message.includes('not authenticated')) {
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }
      }),
    );
};

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
        changePassword: (_result, _args, cache, _info) => {
          betterUpdateQuery<ChangePasswordMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            (result, query) => {
              if (result.changePassword.errors) return query;
              return { me: result.changePassword.user };
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
    exchanges: [cache, errorExchange, ssr, fetchExchange],
  });

  return { client, ssr };
}
