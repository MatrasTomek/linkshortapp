"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteShortLinkAction, updateShortLinkAction } from "./actions";

type LinkItemActionsProps = {
  id: number;
  url: string;
  shortCode: string;
};

export function LinkItemActions({ id, url, shortCode }: LinkItemActionsProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editUrl, setEditUrl] = useState(url);
  const [editShortCode, setEditShortCode] = useState(shortCode);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resetEditForm() {
    setEditUrl(url);
    setEditShortCode(shortCode);
    setEditError(null);
  }

  function onEditDialogOpenChange(nextOpen: boolean) {
    setIsEditOpen(nextOpen);
    if (!nextOpen) {
      resetEditForm();
    }
  }

  function onDeleteDialogOpenChange(nextOpen: boolean) {
    setIsDeleteOpen(nextOpen);
    if (!nextOpen) {
      setDeleteError(null);
    }
  }

  function onEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEditError(null);

    startTransition(async () => {
      const result = await updateShortLinkAction({
        id,
        url: editUrl,
        shortCode: editShortCode,
      });

      if (!result.success) {
        setEditError(result.error);
        return;
      }

      setIsEditOpen(false);
      router.refresh();
    });
  }

  function onDeleteConfirm() {
    setDeleteError(null);

    startTransition(async () => {
      const result = await deleteShortLinkAction({ id });

      if (!result.success) {
        setDeleteError(result.error);
        return;
      }

      setIsDeleteOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Dialog open={isEditOpen} onOpenChange={onEditDialogOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Edytuj
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj link</DialogTitle>
            <DialogDescription>
              Zmień adres docelowy lub kod skrótu dla tego linku.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`edit-url-${id}`}>Docelowy URL</Label>
              <Input
                id={`edit-url-${id}`}
                type="url"
                value={editUrl}
                onChange={(event) => setEditUrl(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`edit-code-${id}`}>Kod skrótu</Label>
              <Input
                id={`edit-code-${id}`}
                type="text"
                value={editShortCode}
                onChange={(event) => setEditShortCode(event.target.value)}
                required
              />
            </div>

            {editError ? (
              <p className="text-sm text-destructive">{editError}</p>
            ) : null}

            <DialogFooter className="-mx-0 -mb-0 border-t-0 bg-transparent p-0 pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Anuluj
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Zapisywanie..." : "Zapisz zmiany"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={onDeleteDialogOpenChange}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            Usuń
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usuń link?</DialogTitle>
            <DialogDescription>
              Tej operacji nie można cofnąć. Link /{shortCode} zostanie trwale
              usunięty.
            </DialogDescription>
          </DialogHeader>

          {deleteError ? (
            <p className="text-sm text-destructive">{deleteError}</p>
          ) : null}

          <DialogFooter className="-mx-0 -mb-0 border-t-0 bg-transparent p-0 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Anuluj
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={onDeleteConfirm}
              disabled={isPending}
            >
              {isPending ? "Usuwanie..." : "Potwierdź usunięcie"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
