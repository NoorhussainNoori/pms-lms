import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Book,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PieChart,
  Users,
  X,
  Activity,
  FolderKanban,
  Briefcase,
  Wallet,
  BookOpen,
  Building,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [location] = useLocation();
  
  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem("demoUser");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
    setIsLoading(false);
  }, []);

  function handleLogout() {
    localStorage.removeItem("demoUser");
    window.location.href = "/auth";
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If not logged in, redirect to auth page
  if (!user) {
    window.location.href = "/auth";
    return null;
  }

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard
    },
    {
      title: "LMS",
      items: [
        { title: "Courses", href: "/courses", icon: Book },
        { title: "Students", href: "/students", icon: Users },
        { title: "Quizzes", href: "/quizzes", icon: FileText },
        { title: "Instructors", href: "/instructors", icon: GraduationCap }
      ]
    },
    {
      title: "Project Management",
      items: [
        { title: "Projects", href: "/projects", icon: FolderKanban },
        { title: "Tasks", href: "/tasks", icon: Activity },
        { title: "Employees", href: "/employees", icon: Briefcase },
        { title: "Clients", href: "/clients", icon: Building }
      ]
    },
    {
      title: "Financial",
      items: [
        { title: "Payments", href: "/payments", icon: CreditCard },
        { title: "Income", href: "/income", icon: DollarSign },
        { title: "Expenses", href: "/expenses", icon: Wallet },
        { title: "Reports", href: "/reports", icon: PieChart }
      ]
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out bg-card border-r border-border md:relative md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">LMS & PM System</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-6">
              {navigationItems.map((navItem, idx) => (
                <li key={idx} className="space-y-2">
                  {navItem.href ? (
                    <Link href={navItem.href}>
                      <div
                        className={cn(
                          "flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer",
                          location === navItem.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-primary"
                        )}
                      >
                        {navItem.icon && <navItem.icon className="h-5 w-5" />}
                        <span>{navItem.title}</span>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {navItem.title}
                      </div>
                      <ul className="space-y-1 pt-1">
                        {navItem.items?.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <Link href={item.href}>
                              <div
                                className={cn(
                                  "flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer",
                                  location === item.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                                )}
                              >
                                {item.icon && <item.icon className="h-4 w-4" />}
                                <span>{item.title}</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User area */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border px-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1" />
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}