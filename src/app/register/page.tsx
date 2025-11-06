import Register from '@/src/components/pages/register'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
	title: 'Register'
}

export default function Page() {
	return <Register />
}
