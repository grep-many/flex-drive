"use client";
import React from "react";
import Logo from "./Logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { logoutSVG, menuSVG } from "@/assets";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

interface Props {
  ownerId: string;
  accountId: string;
  avatar: string;
  fullName: string;
  email: string;
}

const MobileNavigation = ({ avatar, ownerId, accountId, fullName, email }: Props) => {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="mobile-header">
      <Logo size={52} className="h-auto" />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image src={menuSVG} alt="menu" width={30} height={30} />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle>
            <SheetDescription />
            <div className="header-user">
              <Image
                src={avatar}
                alt="avatar"
                width={44}
                height={44}
                className="header-user-avatar"
              />
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <Separator className="bg-light-200/20 mb-4" />
          </SheetTitle>
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map(({ name, icon, url }) => (
                <Link href={url} key={url} className="lg:w-full">
                  <li className={cn("mobile-nav-item", pathname === url && "shad-active")}>
                    <Image
                      src={icon}
                      alt={name}
                      width={24}
                      height={24}
                      className={cn("nav-icon", pathname === url && "nav-icon-active")}
                    />
                    {name}
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
          <Separator className="bg-light-200/20 my-5" />

          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader ownerId={ownerId} accountId={accountId} />
            <Button
              type="submit"
              className="mobile-sign-out-button"
              onClick={async () => await signOutUser()}
            >
              <Image src={logoutSVG} alt="logo" width={24} height={24} />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
