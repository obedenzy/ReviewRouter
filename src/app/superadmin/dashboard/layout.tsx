
import type { PropsWithChildren } from "react";
import React from 'react';
import { redirect } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons/logo";
import { UserNav } from "@/components/dashboard/user-nav";
import { SuperAdminNav } from "@/components/superadmin/super-admin-nav";
import { getSession } from "@/lib/session";
import { getCurrentUser } from "@/lib/actions";

export default async function SuperAdminDashboardLayout({ children }: PropsWithChildren) {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    const user = await getCurrentUser();
     if (!user) {
        redirect('/login');
    }

    // This is a basic check. In a real app, you'd have a more robust role system.
    if (user.email !== 'superadmin@reviewrouter.com') {
        redirect('/dashboard');
    }

    return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SuperAdminNav />
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col w-full">
            <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                <SidebarTrigger variant="ghost" size="icon" className="md:hidden size-8" />
                <h1 className="flex-1 text-xl font-semibold tracking-tight">Super Admin</h1>
                <UserNav user={user} />
            </header>
            <main className="flex-1 p-4 sm:p-6 md:p-8 bg-muted/40 overflow-y-auto">
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
