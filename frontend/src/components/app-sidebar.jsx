"use client";

import {
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Store,
  Users,
  LogOut,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const sellerNav = {
  user: {
    name: "Aakash Gupta",
    email: "seller@cartflow.com",
    avatar: "/avatars/seller.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/seller",
      icon: BarChart3,
      isActive: true,
    },
    {
      title: "Products",
      url: "/seller/products",
      icon: Package,
      items: [
        { title: "All Products", url: "/seller/products" },
        { title: "Add Product", url: "/seller/products/new" },
      ],
    },
    {
      title: "Orders",
      url: "/seller/orders",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      url: "/seller/customers",
      icon: Users,
    },
    {
      title: "Store Settings",
      url: "/seller/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar(props) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! border-r bg-white"
      {...props}
    >
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/seller">
                <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
                  <Store className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-gray-800">
                    Seller Panel
                  </span>
                  <span className="truncate text-xs text-gray-500">
                    CartFlow
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* MAIN NAV */}
      <SidebarContent>
        <NavMain items={sellerNav.navMain} />
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <div className="flex flex-col gap-1">
          <NavUser user={sellerNav.user} />
          <button
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-4 py-2"
            onClick={() => console.log("Logout Clicked")}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
