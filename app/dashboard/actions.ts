"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createShortLink,
  deleteShortLink,
  updateShortLink,
} from "@/data/short-links";

type CreateShortLinkActionInput = {
  url: string;
  customCode?: string;
};

type CreateShortLinkActionResult =
  | {
      success: true;
      data: {
        id: number;
        shortCode: string;
        url: string;
        createdAt: Date;
      };
    }
  | {
      success: false;
      error: string;
    };

type UpdateShortLinkActionInput = {
  id: number;
  url: string;
  shortCode: string;
};

type UpdateShortLinkActionResult =
  | {
      success: true;
      data: {
        id: number;
        shortCode: string;
        url: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  | {
      success: false;
      error: string;
    };

type DeleteShortLinkActionInput = {
  id: number;
};

type DeleteShortLinkActionResult =
  | {
      success: true;
      data: {
        id: number;
      };
    }
  | {
      success: false;
      error: string;
    };

const createShortLinkSchema = z.object({
  url: z.url({ error: "Podaj poprawny adres URL." }),
  customCode: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_-]+$/, {
      error: "Kod może zawierać tylko litery, cyfry, _ oraz -.",
    })
    .min(4, { error: "Kod musi mieć minimum 4 znaki." })
    .max(20, { error: "Kod może mieć maksymalnie 20 znaków." })
    .optional()
    .or(z.literal("")),
});

const updateShortLinkSchema = z.object({
  id: z.number().int().positive({ error: "Niepoprawny identyfikator linku." }),
  url: z.url({ error: "Podaj poprawny adres URL." }),
  shortCode: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_-]+$/, {
      error: "Kod może zawierać tylko litery, cyfry, _ oraz -.",
    })
    .min(4, { error: "Kod musi mieć minimum 4 znaki." })
    .max(20, { error: "Kod może mieć maksymalnie 20 znaków." }),
});

const deleteShortLinkSchema = z.object({
  id: z.number().int().positive({ error: "Niepoprawny identyfikator linku." }),
});

export async function createShortLinkAction(
  input: CreateShortLinkActionInput,
): Promise<CreateShortLinkActionResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Musisz być zalogowany." };
  }

  const parsedInput = createShortLinkSchema.safeParse(input);

  if (!parsedInput.success) {
    const firstError =
      parsedInput.error.issues.at(0)?.message ?? "Niepoprawne dane formularza.";
    return { success: false, error: firstError };
  }

  const customCode = parsedInput.data.customCode?.trim();
  const result = await createShortLink({
    clerkUserId: userId,
    url: parsedInput.data.url.trim(),
    shortCode: customCode ? customCode : undefined,
  });

  if (!result.success) {
    if (result.error === "SHORT_CODE_TAKEN") {
      return { success: false, error: "Wybrany kod jest już zajęty." };
    }

    if (result.error === "SHORT_CODE_GENERATION_FAILED") {
      return {
        success: false,
        error: "Nie udało się wygenerować unikalnego kodu. Spróbuj ponownie.",
      };
    }

    return { success: false, error: "Wystąpił błąd podczas zapisu linku." };
  }

  revalidatePath("/dashboard");

  return { success: true, data: result.data };
}

export async function updateShortLinkAction(
  input: UpdateShortLinkActionInput,
): Promise<UpdateShortLinkActionResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Musisz być zalogowany." };
  }

  const parsedInput = updateShortLinkSchema.safeParse(input);

  if (!parsedInput.success) {
    const firstError =
      parsedInput.error.issues.at(0)?.message ?? "Niepoprawne dane formularza.";
    return { success: false, error: firstError };
  }

  const result = await updateShortLink({
    id: parsedInput.data.id,
    clerkUserId: userId,
    url: parsedInput.data.url.trim(),
    shortCode: parsedInput.data.shortCode.trim(),
  });

  if (!result.success) {
    if (result.error === "SHORT_CODE_TAKEN") {
      return { success: false, error: "Wybrany kod jest już zajęty." };
    }

    if (result.error === "NOT_FOUND") {
      return { success: false, error: "Nie znaleziono linku do edycji." };
    }

    return { success: false, error: "Wystąpił błąd podczas edycji linku." };
  }

  revalidatePath("/dashboard");

  return { success: true, data: result.data };
}

export async function deleteShortLinkAction(
  input: DeleteShortLinkActionInput,
): Promise<DeleteShortLinkActionResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Musisz być zalogowany." };
  }

  const parsedInput = deleteShortLinkSchema.safeParse(input);

  if (!parsedInput.success) {
    const firstError =
      parsedInput.error.issues.at(0)?.message ?? "Niepoprawne dane formularza.";
    return { success: false, error: firstError };
  }

  const result = await deleteShortLink({
    id: parsedInput.data.id,
    clerkUserId: userId,
  });

  if (!result.success) {
    if (result.error === "NOT_FOUND") {
      return { success: false, error: "Nie znaleziono linku do usunięcia." };
    }

    return { success: false, error: "Wystąpił błąd podczas usuwania linku." };
  }

  revalidatePath("/dashboard");

  return { success: true, data: result.data };
}
