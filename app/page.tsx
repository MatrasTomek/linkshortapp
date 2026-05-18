import Link from 'next/link';
import { SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';

export default async function Home() {
	const { userId } = await auth();

	return (
		<main className="flex flex-1 items-center justify-center px-4 py-16">
			<section className="w-full max-w-xl rounded-xl border bg-card p-8 text-center shadow-sm">
				<h1 className="text-3xl font-semibold tracking-tight">LinkShortApp</h1>
				<p className="mt-3 text-muted-foreground">Skracaj i zarzadzaj linkami w jednym miejscu.</p>
				<div className="mt-8 flex items-center justify-center gap-3">
					{userId ? (
						<Button asChild>
							<Link href="/dashboard">Go to dashboard</Link>
						</Button>
					) : (
						<SignInButton mode="modal">
							<Button>Sign in</Button>
						</SignInButton>
					)}
				</div>
			</section>
		</main>
	);
}
