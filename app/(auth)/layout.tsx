import { filesImg, logoImg } from "@/assets";
import Image from "next/image";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <main className="flex min-h-screen">
    <section className="bg-brand hidden w-1/2 items-center justify-center p-10 lg:flex xl:w-2/5">
      <div className="flex max-h-200 max-w-107.5 flex-col justify-center space-y-12">
        <span className="flex items-center gap-1 text-[calc(82px/1.8)] font-black text-white text-shadow-black text-shadow-sm">
          <Image
            src={logoImg}
            alt="logo"
            width={82}
            height={82}
            className="h-auto drop-shadow-xs drop-shadow-black"
          />
          FlexDrive
        </span>
        <div className="space-y-5 text-white">
          <h1 className="h1">Manage your files the best way</h1>
          <p className="body-1">This is a place where you can store all your documents</p>
          <Image
            src={filesImg}
            alt="Files"
            width={342}
            height={342}
            className="cursor-pointer transition-all hover:scale-105 hover:rotate-2"
          />
        </div>
      </div>
    </section>
    <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
      <div className="mb-16 lg:hidden">
        <span className="flex w-50 items-center justify-center gap-1 text-[calc(82px/1.8)] font-black text-white text-shadow-black text-shadow-sm lg:w-62.5">
          <Image
            src={logoImg}
            alt="logo"
            height={82}
            width={82}
            className="h-auto drop-shadow-xs drop-shadow-black"
          />
          FlexDrive
        </span>
      </div>
      {children}
    </section>
  </main>
);

export default Layout;
