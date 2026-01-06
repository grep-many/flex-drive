import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  if (!user) return redirect("/sign-in");

  return (
    <main className="flex h-screen">
      <Sidebar {...user} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...user} />
        <Header {...user} />
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
};
export default Layout;
