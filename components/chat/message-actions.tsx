"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MessageActionsProps {
  messageId: string;
  isSender: boolean;
  onReply: () => void;
  onEdit: () => void;
  onDelete: (deleteFor: "self" | "everyone") => void;
}

export function MessageActions({
  messageId,
  isSender,
  onReply,
  onEdit,
  onDelete,
}: MessageActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <Icons.ellipsis className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40 rounded-xl border-primary/20"
        >
          <DropdownMenuItem onClick={onReply}>
            <Icons.messageCircle className="mr-2 h-4 w-4" />
            Reply
          </DropdownMenuItem>

          {isSender && (
            <>
              <DropdownMenuItem onClick={onEdit}>
                <Icons.edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                <Icons.trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(messageId)}
          >
            <Icons.copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-xl border-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Choose how you want to delete this message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-lg bg-amber-500 hover:bg-amber-600"
              onClick={() => onDelete("self")}
            >
              Delete for me
            </AlertDialogAction>
            {isSender && (
              <AlertDialogAction
                className="rounded-lg bg-destructive hover:bg-destructive/90"
                onClick={() => onDelete("everyone")}
              >
                Delete for everyone
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
