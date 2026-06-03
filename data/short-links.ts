import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { shortLinks } from '@/db/schema';

type CreateShortLinkInput = {
	clerkUserId: string;
	url: string;
	shortCode?: string;
};

type CreateShortLinkData = {
	id: number;
	shortCode: string;
	url: string;
	createdAt: Date;
};

type CreateShortLinkResult =
	| { success: true; data: CreateShortLinkData }
	| { success: false; error: 'SHORT_CODE_TAKEN' | 'SHORT_CODE_GENERATION_FAILED' | 'UNKNOWN' };

type UpdateShortLinkInput = {
	id: number;
	clerkUserId: string;
	url: string;
	shortCode: string;
};

type UpdateShortLinkData = {
	id: number;
	shortCode: string;
	url: string;
	createdAt: Date;
	updatedAt: Date;
};

type UpdateShortLinkResult =
	| { success: true; data: UpdateShortLinkData }
	| { success: false; error: 'SHORT_CODE_TAKEN' | 'NOT_FOUND' | 'UNKNOWN' };

type DeleteShortLinkInput = {
	id: number;
	clerkUserId: string;
};

type DeleteShortLinkResult = { success: true; data: { id: number } } | { success: false; error: 'NOT_FOUND' | 'UNKNOWN' };

const SHORT_CODE_ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const SHORT_CODE_LENGTH = 7;
const AUTO_SHORT_CODE_ATTEMPTS = 5;

function isUniqueViolation(error: unknown) {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		typeof (error as { code?: unknown }).code === 'string' &&
		(error as { code: string }).code === '23505'
	);
}

function createRandomShortCode() {
	let code = '';

	for (let index = 0; index < SHORT_CODE_LENGTH; index += 1) {
		const randomIndex = Math.floor(Math.random() * SHORT_CODE_ALPHABET.length);
		code += SHORT_CODE_ALPHABET[randomIndex];
	}

	return code;
}

async function insertShortLink(input: { clerkUserId: string; url: string; shortCode: string }) {
	const [createdLink] = await db
		.insert(shortLinks)
		.values({
			clerkUserId: input.clerkUserId,
			url: input.url,
			shortCode: input.shortCode,
		})
		.returning({
			id: shortLinks.id,
			shortCode: shortLinks.shortCode,
			url: shortLinks.url,
			createdAt: shortLinks.createdAt,
		});

	return createdLink;
}

export async function getShortLinkByShortCode(shortCode: string) {
	const [link] = await db
		.select({
			url: shortLinks.url,
		})
		.from(shortLinks)
		.where(eq(shortLinks.shortCode, shortCode))
		.limit(1);

	return link ?? null;
}

export async function getShortLinksByUserId(userId: string) {
	return db
		.select({
			id: shortLinks.id,
			shortCode: shortLinks.shortCode,
			url: shortLinks.url,
			createdAt: shortLinks.createdAt,
		})
		.from(shortLinks)
		.where(eq(shortLinks.clerkUserId, userId))
		.orderBy(desc(shortLinks.createdAt));
}

export async function createShortLink(input: CreateShortLinkInput): Promise<CreateShortLinkResult> {
	if (input.shortCode) {
		try {
			const createdLink = await insertShortLink({
				clerkUserId: input.clerkUserId,
				url: input.url,
				shortCode: input.shortCode,
			});

			return { success: true, data: createdLink };
		} catch (error) {
			if (isUniqueViolation(error)) {
				return { success: false, error: 'SHORT_CODE_TAKEN' };
			}

			return { success: false, error: 'UNKNOWN' };
		}
	}

	for (let attempt = 0; attempt < AUTO_SHORT_CODE_ATTEMPTS; attempt += 1) {
		try {
			const createdLink = await insertShortLink({
				clerkUserId: input.clerkUserId,
				url: input.url,
				shortCode: createRandomShortCode(),
			});

			return { success: true, data: createdLink };
		} catch (error) {
			if (isUniqueViolation(error)) {
				continue;
			}

			return { success: false, error: 'UNKNOWN' };
		}
	}

	return { success: false, error: 'SHORT_CODE_GENERATION_FAILED' };
}

export async function updateShortLink(input: UpdateShortLinkInput): Promise<UpdateShortLinkResult> {
	try {
		const [updatedLink] = await db
			.update(shortLinks)
			.set({
				url: input.url,
				shortCode: input.shortCode,
				updatedAt: new Date(),
			})
			.where(and(eq(shortLinks.id, input.id), eq(shortLinks.clerkUserId, input.clerkUserId)))
			.returning({
				id: shortLinks.id,
				shortCode: shortLinks.shortCode,
				url: shortLinks.url,
				createdAt: shortLinks.createdAt,
				updatedAt: shortLinks.updatedAt,
			});

		if (!updatedLink) {
			return { success: false, error: 'NOT_FOUND' };
		}

		return { success: true, data: updatedLink };
	} catch (error) {
		if (isUniqueViolation(error)) {
			return { success: false, error: 'SHORT_CODE_TAKEN' };
		}

		return { success: false, error: 'UNKNOWN' };
	}
}

export async function deleteShortLink(input: DeleteShortLinkInput): Promise<DeleteShortLinkResult> {
	try {
		const [deletedLink] = await db
			.delete(shortLinks)
			.where(and(eq(shortLinks.id, input.id), eq(shortLinks.clerkUserId, input.clerkUserId)))
			.returning({
				id: shortLinks.id,
			});

		if (!deletedLink) {
			return { success: false, error: 'NOT_FOUND' };
		}

		return { success: true, data: deletedLink };
	} catch {
		return { success: false, error: 'UNKNOWN' };
	}
}
