"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { loaderSVG } from "@/assets";
import { renameFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";

interface Props {
  file: FileRowData;
}

const ActionDialog = React.forwardRef(({ file }: Props, ref) => {
  const [action, setAction] = React.useState<ActionType | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState(file.name);

  React.useImperativeHandle(ref, () => ({
    open(option: ActionType) {
      setAction(option);
    },
    close() {
      setAction(null);
    },
  }));

  const path = usePathname();

  if (!action) return;
  const { label, icon, value } = action;

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    const actions = {
      rename: () => {
        if (name === file.name) return false;
        return renameFile({
          fileId: file.$id,
          extension: file.extension,
          name,
          path,
        });
      },
      share: () => console.log("share"),
      delete: () => console.log("delete"),
    };
    let success = await actions[action.value as keyof typeof actions]();
    if (!success) return;
    setAction(null);
  };

  return (
    <Dialog
      open={action !== null}
      onOpenChange={(open) => {
        if (!open) setAction(null);
      }}
    >
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-light-100 flex items-center justify-center gap-2">
            <Image src={icon} alt={value} height={30} width={30} />
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          )}
        </DialogHeader>
        {value !== "delete" && (
          <DialogFooter className="flex flex-col justify-around! gap-3 md:flex-row">
            <Button
              variant="outline"
              className="modal-cancel-button"
              onClick={() => setAction(null)}
            >
              Cancel
            </Button>
            <Button className="modal-submit-button capitalize" onClick={handleAction}>
              {value}
              {isLoading && (
                <Image
                  src={loaderSVG}
                  className="animate-spin"
                  alt="loading..."
                  height={24}
                  width={24}
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
});

ActionDialog.displayName = "ActionDialog";

export default ActionDialog;
