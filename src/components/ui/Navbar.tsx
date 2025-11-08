'use client';

import { useLogoutMutation, useMeQuery } from '@/src/generated/graphql';
import Link from 'next/link';

const Navbar = () => {
  const [{ data, fetching }] = useMeQuery();
  const [, logout] = useLogoutMutation();

  return (
    <div className="bg-orange-300">
      <div className="ml-auto flex justify-end p-4">
        {!fetching &&
          (data?.me ? (
            <>
              <p className="mx-2">{data.me.username}</p>
              <button className="mx-2" onClick={() => logout({})}>
                logout
              </button>
            </>
          ) : (
            <>
              <Link className="mx-2" href="/login">
                login
              </Link>
              <Link className="mx-2" href="/register">
                register
              </Link>
            </>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
