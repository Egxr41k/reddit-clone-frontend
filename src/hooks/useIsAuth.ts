import { useMeQuery } from '@/src/graphql/generated/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace('/login');
    }
  }, [fetching, data, router]);
};
