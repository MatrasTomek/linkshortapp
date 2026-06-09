"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createShortLinkAction } from "./actions";

export function CreateLinkDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resetForm() {
    setUrl("");
    setCustomCode("");
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function onDialogOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await createShortLinkAction({
        url,
        customCode,
      });

      if (!result.success) {
        setErrorMessage(result.error);
        return;
      }

      setSuccessMessage(`Utworzono link: /${result.data.shortCode}`);
      router.refresh();
      setTimeout(() => {
        setOpen(false);
      }, 700);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>
        <Button>Utwórz link</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nowy skrócony link</DialogTitle>
          <DialogDescription>
            Wprowadź adres docelowy i opcjonalnie własny kod skrótu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target-url">Docelowy URL</Label>
            <Input
              id="target-url"
              type="url"
              placeholder="https://example.com/oferta"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-code">Własny kod (opcjonalnie)</Label>
            <Input
              id="custom-code"
              type="text"
              placeholder="moja-oferta"
              value={customCode}
              onChange={(event) => setCustomCode(event.target.value)}
            />
          </div>

          {errorMessage ? (
            <p className="text-sm text-destructive">{errorMessage}</p>
          ) : null}
          {successMessage ? (
            <p className="text-sm text-emerald-600">{successMessage}</p>
          ) : null}

          <DialogFooter className="-mx-0 -mb-0 border-t-0 bg-transparent p-0 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? "Zapisywanie..." : "Zapisz link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
