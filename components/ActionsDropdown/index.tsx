"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { dotsSVG } from "@/assets";
import { actionsDropdownItems } from "@/constants";
import ActionDropdownButton from "./ActionDropdownButton";
import ActionDialog from "./ActionDialog";

interface Props {
  file: FileRowData;
}
const ActionsDropdown = ({ file }: Props) => {
  const dialog = React.useRef<DialogMethods | null>(null);
  const preventDefault = (e: React.MouseEvent<HTMLElement>) => e.preventDefault();
  const stopPropagation = (e: React.MouseEvent<HTMLElement>) => e.stopPropagation();
  const onClickAction = (option: ActionType) => {
    if (option.value === "download") return;
    dialog.current?.open(option);
  };

  return (
    <div onClick={preventDefault} onMouseDown={preventDefault}>
      <DropdownMenu>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image src={dotsSVG} alt="..." width={34} height={34} />
        </DropdownMenuTrigger>
        <DropdownMenuContent onClick={stopPropagation}>
          <DropdownMenuLabel className="max-w-50 truncate">{file.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className="shad-dropdown-item"
              onClick={() => onClickAction(option)}
            >
              <ActionDropdownButton file={file} option={option} />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <ActionDialog ref={dialog} file={file} />
    </div>
  );
};

export default ActionsDropdown;
