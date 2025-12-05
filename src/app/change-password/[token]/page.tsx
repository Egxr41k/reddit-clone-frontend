import ChangePassword from '@/src/components/pages/ChangePassword';

interface IPageTokenParam {
  params: Promise<{ token: string }>;
}

export default async function Page({ params }: IPageTokenParam) {
  const { token } = await params;
  return <ChangePassword token={token} />;
}
