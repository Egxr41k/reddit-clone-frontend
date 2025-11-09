import { registerUrql } from '@urql/next/rsc';
import Navbar from '../components/ui/Navbar';
import { PostsDocument } from '../graphql/generated/server';
import { makeClient } from '../provider/makeClient';

const { getClient } = registerUrql(() => makeClient().client);

export default async function Home() {
  const { data } = await getClient().query(PostsDocument, {});

  return (
    <>
      <Navbar />
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </>
  );
}
