import Auth from '@/src/components/pages/Auth';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'login',
};

export default function Page() {
  return <Auth type="login" />;
}
