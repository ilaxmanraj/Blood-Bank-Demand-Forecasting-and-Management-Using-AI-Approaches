import {
  LayoutDashboard,
  Droplets,
  Users,
  Activity,
  BrainCircuit,
  Bell,
  ClipboardList,
  Settings,
  Heart,
  LogOut,
  UserPlus,
  ClipboardPlus,
} from "lucide-react";

import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon: any;
  roles?: string[];
};

/* ---------------- NAVIGATION ---------------- */

const mainNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },

  { title: "Inventory", url: "/inventory", icon: Droplets, roles: ["ADMIN", "HOSPITAL"] },

  { title: "Donors", url: "/donors", icon: Users, roles: ["ADMIN"] },

  { title: "Register Donor", url: "/donors/register", icon: UserPlus, roles: ["DONOR"] },

  { title: "Requests", url: "/requests", icon: ClipboardList, roles: ["ADMIN", "HOSPITAL"] },

  { title: "Create Request", url: "/requests/create", icon: ClipboardPlus, roles: ["HOSPITAL"] },
];

const aiNav: NavItem[] = [
  { title: "AI Forecasting", url: "/forecasting", icon: BrainCircuit, roles: ["ADMIN"] },

  { title: "Analytics", url: "/analytics", icon: Activity, roles: ["ADMIN"] },
];

const systemNav: NavItem[] = [
  { title: "Notifications", url: "/notifications", icon: Bell },

  { title: "Settings", url: "/settings", icon: Settings, roles: ["ADMIN"] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const role = localStorage.getItem("role");

  const handleLogout = () => {
    signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/auth", { replace: true });
  };

  /* ---------------- FILTER NAV BY ROLE ---------------- */

  const filterNav = (items: NavItem[]) => {
    return items.filter((item) => {
      if (!item.roles) return true;
      return role && item.roles.includes(role);
    });
  };

  const renderNav = (items: NavItem[], label: string) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider font-semibold">
        {!collapsed && label}
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {filterNav(items).map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0">

      {/* HEADER */}

      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Heart className="h-4 w-4 text-primary-foreground" />
          </div>

          {!collapsed && (
            <div>
              <h2 className="text-sm font-bold text-sidebar-accent-foreground">
                BloodBank AI
              </h2>

              <p className="text-[10px] text-sidebar-foreground/50">
                Demand Forecasting
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* NAVIGATION */}

      <SidebarContent>
        {renderNav(mainNav, "Management")}
        {renderNav(aiNav, "AI Engine")}
        {renderNav(systemNav, "System")}
      </SidebarContent>

      {/* FOOTER */}

      <SidebarFooter className="p-3 space-y-2">

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent/50">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-sidebar-primary">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </span>
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">
                {user?.full_name || user?.email || "User"}
              </p>

              <p className="text-[10px] text-sidebar-foreground/50 truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive transition-colors w-full"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

      </SidebarFooter>

    </Sidebar>
  );
}