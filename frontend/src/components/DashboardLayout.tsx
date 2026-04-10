import React, { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAlerts } from "@/services/api"; // ✅ NEW

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {

  const [alertCount, setAlertCount] = useState(0); // ✅ NEW

  useEffect(() => {
    loadAlerts();

    const interval = setInterval(loadAlerts, 15000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  async function loadAlerts() {
    try {
      const data = await getAlerts();
      setAlertCount(Array.isArray(data) ? data.length : 0);
    } catch {
      setAlertCount(0);
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        
        {/* Sidebar */}
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <header className="h-14 flex items-center justify-between border-b bg-card/50 backdrop-blur-sm px-4 sticky top-0 z-10">
            
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

              <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />

                <input
                  type="text"
                  placeholder="Search donors, requests..."
                  className="bg-transparent text-sm outline-none w-64 placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              
              {/* 🔔 NOTIFICATION BELL */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4 text-muted-foreground" />

                {alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                    {alertCount}
                  </span>
                )}
              </Button>

              <Badge
                variant="outline"
                className="text-[10px] bg-accent text-accent-foreground border-primary/20"
              >
                AI Active
              </Badge>

            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>

        </div>
      </div>
    </SidebarProvider>
  );
}