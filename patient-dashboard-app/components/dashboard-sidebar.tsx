"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CarexLogo } from "./carex-logo"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  User,
  FileText,
  Key,
  History,
  Settings,
  Shield,
  Menu,
  X,
  Activity,
  Share2,
  Map,
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Activity, label: "Health Timeline", href: "/dashboard/timeline" },
  { icon: FileText, label: "Medical Records", href: "/dashboard/records" },
  { icon: Key, label: "Access Keys", href: "/dashboard/keys" },
  { icon: Share2, label: "Share Access", href: "/dashboard/share" },
  { icon: History, label: "Access Logs", href: "/dashboard/logs" },
  { icon: Map, label: "User Journey", href: "/dashboard/journey" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-sidebar-border">
          <CarexLogo />
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border border-primary/20"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                <span>{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">Security Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground">All systems protected</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
