import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppShellSidebar } from "@/components/app-shell-sidebar";
import { DashboardProviders } from "./dashboard-providers";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <DashboardProviders>
      <SidebarProvider defaultOpen={defaultOpen} className="h-svh">
        <AppShellSidebar />
        <SidebarInset className="min-h-0 min-w-0">
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </DashboardProviders>
  );
}