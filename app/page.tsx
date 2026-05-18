import Link from 'next/link';
import { SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';

export default async function Home() {
	const { userId } = await auth();
	const features = [
		{
			title: 'Błyskawiczne skracanie',
			description: 'Zamieniaj długie adresy URL na krótkie linki gotowe do udostępnienia.',
		},
		{
			title: 'Panel zarządzania',
			description: 'Przeglądaj i organizuj swoje linki w jednym, prostym dashboardzie.',
		},
		{
			title: 'Bezpieczne konto',
			description: 'Logowanie i autoryzacja oparte o Clerk dla bezproblemowego dostępu.',
		},
	];

	return (
		<main className="flex flex-1 items-center px-4 py-16">
			<section className="mx-auto w-full max-w-4xl rounded-xl border bg-card p-8 shadow-sm md:p-12">
				<div className="mx-auto max-w-2xl text-center">
					<h1 className="text-4xl font-semibold tracking-tight md:text-5xl">LinkShortApp</h1>
					<p className="mt-4 text-lg text-muted-foreground">
						Nowoczesna strona docelowa do skracania linków, która ułatwia tworzenie, udostępnianie i
						kontrolę nad adresami URL.
					</p>
					<div className="mt-8 flex items-center justify-center gap-3">
						{userId ? (
							<Button asChild>
								<Link href="/dashboard">Przejdź do dashboardu</Link>
							</Button>
						) : (
							<SignInButton mode="modal">
								<Button>Zaloguj się i zacznij</Button>
							</SignInButton>
						)}
					</div>
				</div>

				<ul className="mt-12 grid gap-4 md:grid-cols-3">
					{features.map((feature) => (
						<li key={feature.title} className="rounded-lg border bg-background/50 p-5">
							<h2 className="text-base font-semibold">{feature.title}</h2>
							<p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}
