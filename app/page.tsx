import Link from 'next/link';
import { SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';

const features = [
	{
		title: 'Szybkie skracanie URL',
		description: 'Wklej link i w sekundę twórz czytelne, krótkie adresy gotowe do publikacji.',
	},
	{
		title: 'Analityka i kontrola',
		description: 'Sprawdzaj skuteczność kampanii i zarządzaj linkami z jednego panelu.',
	},
	{
		title: 'Zespół i bezpieczeństwo',
		description: 'Bezpieczne logowanie przez Clerk i wygodna praca nad linkami w jednym miejscu.',
	},
];

const highlights = [
	{ label: 'Tworzenie krótkich linków', value: 'Bez zbędnych kroków' },
	{ label: 'Praca z zespołem', value: 'Jedno miejsce dla całego zespołu' },
	{ label: 'Bezpieczny dostęp', value: 'Sprawdzone logowanie i autoryzacja' },
];

export default async function Home() {
	const { userId } = await auth();

	return (
		<main className="flex flex-1 px-4 py-12 md:py-16">
			<section className="mx-auto w-full max-w-5xl rounded-2xl border bg-card/60 p-8 shadow-sm backdrop-blur md:p-12">
				<div className="mx-auto max-w-3xl text-center">
					<span className="mx-auto inline-flex rounded-full border px-3 py-1 text-xs text-muted-foreground">
						Platforma SaaS do zarządzania krótkimi linkami
					</span>
					<h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
						Skracaj linki, mierz wyniki i skaluj kampanie z LinkShortApp
					</h1>
					<p className="mt-5 text-lg text-muted-foreground">
						Twórz krótkie URL-e dla social media, newsletterów i reklam. Wszystko w jednym dashboardzie,
						z wygodnym logowaniem i szybkim dostępem dla Twojego zespołu.
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
						{userId ? (
							<Button asChild>
								<Link href="/dashboard">Przejdź do dashboardu</Link>
							</Button>
						) : (
							<SignInButton mode="modal">
								<Button>Zacznij za darmo</Button>
							</SignInButton>
						)}
						<Button asChild variant="outline">
							<Link href="#funkcje">Zobacz funkcje</Link>
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

				<ul id="funkcje" className="mt-8 grid gap-4 md:grid-cols-3">
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
