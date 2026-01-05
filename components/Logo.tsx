import { logoImg } from "@/assets";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Logo = ({ className = "", size = 82, responsive = false }) => (
  <span
    className={cn(
      `flex items-center gap-1 text-[calc(${size}px/1.8)] font-black text-white text-shadow-black text-shadow-sm`,
      className,
    )}
  >
    <Image
      src={logoImg}
      loading="eager"
      alt="logo"
      width={size}
      height={size}
      className="h-auto drop-shadow-xs drop-shadow-black"
    />
    {responsive ? <span className="hidden">FlexDrive</span> : <>FlexDrive</>}
  </span>
);

export default Logo;
