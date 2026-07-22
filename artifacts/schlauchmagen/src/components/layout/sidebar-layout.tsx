import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, CheckSquare, Calendar, BookHeart, Activity, LogOut, Menu, ClipboardList, Stethoscope, MessageCircleHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { clearToken } from "@/hooks/useAuth";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    clearToken();
    setLocation("/login");
  };

  const navItems = [
    { href: "/", label: "Übersicht", icon: LayoutDashboard },
    { href: "/chatbot", label: "KI-Begleiter", icon: MessageCircleHeart },
    { href: "/eingangstest", label: "Eingangstest", icon: ClipboardList },
    { href: "/beratung", label: "Beratung", icon: Stethoscope },
    { href: "/voraussetzungen", label: "Anforderungen", icon: CheckSquare },
    { href: "/termine", label: "Termine", icon: Calendar },
    { href: "/tagebuch", label: "Tagebuch", icon: BookHeart },
    { href: "/gewicht", label: "Gewichtsprotokoll", icon: Activity },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64 text-sidebar-foreground">
      <div className="p-6 pb-2">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <BookHeart className="h-6 w-6" />
          <span>Mein Begleiter</span>
        </h2>
      </div>
      <nav className="flex-1 py-6 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${
                location === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-r-4 border-primary"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Abmelden
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background w-full">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border flex items-center px-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <span className="font-bold text-primary text-lg">Mein Begleiter</span>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 overflow-y-auto w-full max-w-[1200px] mx-auto">
        {children}
      </main>
    </div>
  );
}
