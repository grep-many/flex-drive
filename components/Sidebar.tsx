"use client";
import Link from "next/link";
import Logo from "./Logo";
import { navItems } from "@/constants";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { avatarImg, files2Img } from "@/assets";

interface Props {
  fullName: string;
  email: string;
}

const Sidebar = ({ email, fullName }: Props) => {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/">
        <Logo size={50} className="hidden h-auto text-gray-200 lg:flex" />
        <Logo size={52} responsive={true} className="lg:hidden" />
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ name, icon, url }, i) => (
            <Link href={url} key={i} className="lg:w-full">
              <li className={cn("sidebar-nav-item", pathname === url && "shad-active")}>
                <Image
                  src={icon}
                  alt={name}
                  width={24}
                  height={24}
                  className={cn("nav-icon", pathname === url && "nav-icon-active")}
                />
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      <Image
        src={files2Img}
        alt="logo"
        width={506}
        height={418}
        className="w-full [@media(max-height:770px)]:hidden"
      />
      <div className="sidebar-user-info">
        <Image
          src={avatarImg}
          alt="avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
