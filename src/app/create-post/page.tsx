import CreatePost from '@/src/components/pages/CreatePost';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Create Post',
};

export default function Page() {
  return <CreatePost />;
}
