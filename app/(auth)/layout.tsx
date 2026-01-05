import { filesImg } from "@/assets";
import Logo from "@/components/Logo";
import { getCurrentUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  if (user) return redirect("/");

  return (
    <main className="flex min-h-screen">
      <section className="bg-brand hidden w-1/2 items-center justify-center p-10 lg:flex xl:w-2/5">
        <div className="flex max-h-200 max-w-107.5 flex-col justify-center space-y-12">
          <Logo />
          <div className="space-y-5 text-white">
            <h1 className="h1">Manage your files the best way</h1>
            <p className="body-1">This is a place where you can store all your documents</p>
            <Image
              src={filesImg}
              alt="Files"
              width={342}
              height={342}
              className="mx-auto max-h-[40vh] w-auto cursor-pointer drop-shadow-sm drop-shadow-black transition-all hover:scale-105 hover:rotate-2 hover:drop-shadow-lg hover:drop-shadow-black"
            />
          </div>
        </div>
      </section>
      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Logo className="w-50 justify-center text-gray-200 lg:w-62.5" />
        </div>
        {children}
      </section>
    </main>
  );
};

export default Layout;
