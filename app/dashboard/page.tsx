import { auth } from '@clerk/nextjs/server';
import { getShortLinksByUserId } from '@/data/short-links';
import { CreateLinkDialog } from './create-link-dialog';
import { LinkItemActions } from './link-item-actions';

export default async function DashboardPage() {
	const { userId } = await auth();

	if (!userId) {
		return null;
	}

	const links = await getShortLinksByUserId(userId);

	return (
		<main className="mx-auto w-full max-w-5xl px-4 py-10">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
					<p className="mt-2 text-sm text-muted-foreground">Twoje skrócone linki:</p>
				</div>
				<CreateLinkDialog />
			</div>

			{links.length === 0 ? (
				<p className="mt-6 rounded-lg border bg-card/50 p-4 text-sm text-muted-foreground">Nie masz jeszcze żadnych linków.</p>
			) : (
				<ul className="mt-6 space-y-3">
					{links.map((link) => (
						<li key={link.id} className="rounded-lg border bg-card/50 p-4">
							<a
								href={`/l/${link.shortCode}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-muted-foreground hover:underline"
							>
								/{link.shortCode}
							</a>
							<p className="mt-1 break-all text-sm">{link.url}</p>
							<p className="mt-2 text-xs text-muted-foreground">Dodano: {link.createdAt.toLocaleString('pl-PL')}</p>
							<LinkItemActions id={link.id} url={link.url} shortCode={link.shortCode} />
						</li>
					))}
				</ul>
			)}
		</main>
	);
}
