
import type { PropsWithChildren } from "react";
import React from 'react';
import { redirect } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons/logo";
import { UserNav } from "@/components/dashboard/user-nav";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getSession } from "@/lib/session";
import { getCurrentUser, getBusiness }from "@/lib/actions";
import Image from "next/image";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getSession();
  if (!session) {
    // This is a fallback. The middleware should handle this primarily.
    redirect('/login');
  }

  const user = await getCurrentUser();
  if (!user) {
     // This is a fallback. The middleware should handle this primarily.
    redirect('/login');
  }

  const business = user.businessId ? await getBusiness(user.businessId) : null;
  
  // React.cloneElement is not reliable for passing props to server component children.
  // Instead, each page component will fetch its own data.

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            {business?.logoUrl ? (
                <div className="relative w-32 h-10">
                    <Image 
                        src={business.logoUrl} 
                        alt={`${business.name} Logo`} 
                        fill
                        className="object-contain"
                    />
                </div>
            ) : (
                <Logo />
            )}
          </SidebarHeader>
          <SidebarContent>
            <DashboardNav />
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col w-full">
            <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                <SidebarTrigger variant="ghost" size="icon" className="md:hidden size-8" />
                <DashboardHeader businessName={business?.name} />
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
