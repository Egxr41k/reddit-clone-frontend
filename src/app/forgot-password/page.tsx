import Auth from '@/src/components/pages/Auth';
import ForgotPassword from '@/src/components/pages/ForgotPassword';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default function Page() {
  return <ForgotPassword />;
}
