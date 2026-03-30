"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserButton } from "@clerk/nextjs";
import {
  type LucideIcon,
  LayoutDashboard,
  KanbanSquare,
  FileText,
  Calendar,
  Brain,
  Bot,
  Users,
  Settings,
} from "lucide-react";

const APP_NAME = "Mission Control";

interface MenuItem {
  title: string;
  url?: string;
  icon: LucideIcon;
}

interface NavSectionProps {
  label?: string;
  items: MenuItem[];
  pathname: string;
}

function NavSection({ label, items, pathname }: NavSectionProps) {
  return (
    <SidebarGroup>
      {label ? (
        <SidebarGroupLabel className="text-[13px] uppercase text-muted-foreground">
          {label}
        </SidebarGroupLabel>
      ) : null}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild={!!item.url}
                isActive={
                  item.url
                    ? item.url === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.url)
                    : false
                }
                tooltip={item.title}
                className="h-9 px-3 py-2 text-[13px] tracking-tight font-medium border border-transparent data-[active=true]:border-border data-[active=true]:shadow-[0px_1px_1px_0px_rgba(44,54,53,0.03),inset_0px_0px_0px_2px_white]"
              >
                {item.url ? (
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <>
                    <item.icon />
                    <span>{item.title}</span>
                  </>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

const mainMenuItems: MenuItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Tasks", url: "/tasks", icon: KanbanSquare },
  { title: "Content", url: "/content", icon: FileText },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Memory", url: "/memory", icon: Brain },
  { title: "AI Team", url: "/ai-team", icon: Bot },
  { title: "Contacts", url: "/contacts", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppShellSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-col gap-4 pt-4">
        <div className="flex items-center gap-2 pl-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0">
          <Image src="/logo.svg" alt={APP_NAME} width={24} height={24} className="rounded-sm" />
          <span className="group-data-[collapsible=icon]:hidden font-semibold text-lg tracking-tighter text-foreground">
            {APP_NAME}
          </span>
          <SidebarTrigger className="ml-auto lg:hidden" />
        </div>
      </SidebarHeader>
      <div className="border-b border-dashed border-border" />
      <SidebarContent>
        <NavSection items={mainMenuItems} pathname={pathname ?? ""} />
      </SidebarContent>
      <div className="border-b border-dashed border-border" />
      <SidebarFooter className="gap-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserButton
              showName
              fallback={
                <Skeleton className="h-8.5 w-full group-data-[collapsible=icon]:size-8 rounded-md border border-border bg-white" />
              }
              appearance={{
                elements: {
                  rootBox:
                    "w-full! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:flex! group-data-[collapsible=icon]:justify-center!",
                  userButtonTrigger:
                    "w-full! justify-between! bg-white! border! border-border! rounded-md! pl-1! pr-2! py-1! shadow-[0px_1px_1.5px_0px_rgba(44,54,53,0.03)]! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:p-1! group-data-[collapsible=icon]:after:hidden! [--border:color-mix(in_srgb,transparent,var(--clerk-color-neutral,#000000)_15%)]!",
                  userButtonBox: "flex-row-reverse! gap-2!",
                  userButtonOuterIdentifier:
                    "text-[13px]! tracking-tight! font-medium! text-foreground! pl-0! group-data-[collapsible=icon]:hidden!",
                  userButtonAvatarBox: "size-6!",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
