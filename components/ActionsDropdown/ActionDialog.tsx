"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { loaderSVG } from "@/assets";
import { deleteFile, renameFile, updateFileUsers } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "./ActionModalContent";

interface Props {
  file: FileRowData;
}

const ActionDialog = React.forwardRef(({ file }: Props, ref) => {
  const [action, setAction] = React.useState<ActionType | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState(
    file.name.replace(new RegExp(`\\.${file.extension}$`), ""),
  );
  const [emails, setEmails] = React.useState<string[]>([]);

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
          name: name.replace(new RegExp(`\\.${file.extension}$`), ""),
          path,
        });
      },
      share: () => {
        if (
          emails.length === file.users.length &&
          emails.every((email) => file.users.includes(email))
        )
          return false;
        return updateFileUsers({
          fileId: file.$id,
          emails: Array.from(new Set([...file.users, ...emails])),
          path,
        });
      },
      delete: () => deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path }),
    };
    let success = await actions[action.value as keyof typeof actions]();
    setIsLoading(false);
    if (!success) return;
    setAction(null);
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = file.users.filter((user) => user !== email);
    await updateFileUsers({ fileId: file.$id, emails: updatedEmails, path });
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
          <DialogDescription />
          {value === "rename" && (
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput file={file} onInputChange={setEmails} onRemove={handleRemoveUser} />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              {" "}
              Are you sure want to delete{` `}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        <DialogFooter className="flex flex-col justify-around! gap-3 md:flex-row">
          <Button
            variant="outline"
            className={
              value !== "details"
                ? "modal-cancel-button"
                : "modal-submit-button text-white hover:text-white"
            }
            onClick={() => setAction(null)}
          >
            {value !== "details" ? "Cancel" : "Ok"}
          </Button>
          {value !== "details" && (
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
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ActionDialog.displayName = "ActionDialog";

export default ActionDialog;
