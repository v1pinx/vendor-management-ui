import { FolderKanban, Network, LayoutDashboard, Car } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
const items = [
  {
    title: "Hierarchy",
    url: "/",
    icon: Network,
  },
  {
    title: "Fleet Driver Management",
    url: "fleet-driver-management",
    icon: Car,
  },
  {
    title: "Super Vendor Dashboard",
    url: "super-vendor-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Vendor Delegation Management",
    url: "vendor-delegation-management",
    icon: FolderKanban,
  },

]

export function SidePanel() {
  return (
    <Sidebar variant="floating" >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-xl mb-3'>Vendor Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
