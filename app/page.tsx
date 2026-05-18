import Link from 'next/link';
import { SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';

const features = [
	{
		title: 'Fast URL shortening',
		description: 'Paste any long link and instantly generate clean short URLs ready to share.',
	},
	{
		title: 'Analytics and control',
		description: 'Track campaign effectiveness and manage all your links from one dashboard.',
	},
	{
		title: 'Team and security',
		description: 'Secure sign-in with Clerk and smooth collaboration for your whole team.',
	},
];

const highlights = [
	{ label: 'Short links creation', value: 'No extra steps' },
	{ label: 'Team collaboration', value: 'One place for your whole team' },
	{ label: 'Secure access', value: 'Trusted sign-in and authorization' },
];

export default async function Home() {
	const { userId } = await auth();

	return (
		<main className="flex flex-1 px-4 py-12 md:py-16">
			<section className="mx-auto w-full max-w-5xl rounded-2xl border bg-card/60 p-8 shadow-sm backdrop-blur md:p-12">
				<div className="mx-auto max-w-3xl text-center">
					<p className="mx-auto inline-flex rounded-full border px-3 py-1 text-xs text-muted-foreground">
						SaaS platform for short-link management
					</p>
					<h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
						Shorten links, measure results, and scale campaigns with LinkShortApp
					</h1>
					<p className="mt-5 text-lg text-muted-foreground">
						Create short URLs for social media, newsletters, and ads. Everything is in one dashboard,
						with secure sign-in and fast access for your team.
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
						{userId ? (
							<Button asChild>
								<Link href="/dashboard">Go to dashboard</Link>
							</Button>
						) : (
							<SignInButton mode="modal">
								<Button>Start for free</Button>
							</SignInButton>
						)}
						<Button asChild variant="outline">
							<Link href="#features">See features</Link>
						</Button>
					</div>
				</div>

				<ul className="mt-10 grid gap-4 sm:grid-cols-3">
					{highlights.map((item) => (
						<li key={item.label} className="rounded-xl border bg-background/50 p-4 text-center">
							<p className="text-2xl font-semibold">{item.value}</p>
							<p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
						</li>
					))}
				</ul>

				<ul id="features" className="mt-8 grid gap-4 md:grid-cols-3">
					{features.map((feature) => (
						<li key={feature.title} className="rounded-xl border bg-background/50 p-5">
							<h2 className="text-base font-semibold">{feature.title}</h2>
							<p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}
