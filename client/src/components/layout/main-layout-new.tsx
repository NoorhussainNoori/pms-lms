import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  Users,
  Book,
  FileText,
  GraduationCap,
  CreditCard,
  PieChart,
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
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  function handleLogout() {
    logoutMutation.mutate();
  }

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE, UserRole.FINANCE],
    },
    {
      title: "LMS",
      items: [
        {
          title: "Courses",
          href: "/courses",
          icon: <Book className="w-5 h-5" />,
          roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT],
        },
        {
          title: "Students",
          href: "/students",
          icon: <GraduationCap className="w-5 h-5" />,
          roles: [UserRole.ADMIN, UserRole.INSTRUCTOR],
        },
        {
          title: "Instructors",
          href: "/instructors",
          icon: <BookOpen className="w-5 h-5" />,
          roles: [UserRole.ADMIN],
        },
        {
          title: "Quizzes",
          href: "/quizzes",
          icon: <FileText className="w-5 h-5" />,
          roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT],
        },
      ],
    },
    {
      title: "Project Management",
      items: [
        {
          title: "Projects",
          href: "/projects",
          icon: <FolderKanban className="w-5 h-5" />,
          roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE],
        },
        {
          title: "Tasks",
          href: "/tasks",
          icon: <Activity className="w-5 h-5" />,
          roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.EMPLOYEE],
        },
        {
          title: "Employees",
          href: "/employees",
          icon: <Briefcase className="w-5 h-5" />,
          roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER],
        },
        {
          title: "Clients",
          href: "/clients",
          icon: <Building className="w-5 h-5" />,
          roles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER],
        },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          title: "Payments",
          href: "/payments",
          icon: <CreditCard className="w-5 h-5" />,
          roles: [UserRole.ADMIN, UserRole.FINANCE],
        },
        {
          title: "Expenses",
          href: "/expenses",
          icon: <Wallet className="w-5 h-5" />,
          roles: [UserRole.ADMIN, UserRole.FINANCE],
        },
        {
          title: "Reports",
          href: "/reports",
          icon: <PieChart className="w-5 h-5" />,
          roles: [UserRole.ADMIN, UserRole.FINANCE],
        },
        {
          title: "Income",
          href: "/income",
          icon: <DollarSign className="w-5 h-5" />,
          roles: [UserRole.ADMIN, UserRole.FINANCE],
        },
      ],
    },
  ];

  function hasAccess(roles: UserRole[]) {
    if (!user) return false;
    return roles.includes(user.role as UserRole);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-y-auto border-r",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="sticky top-0 bg-background z-10 border-b">
            <div className="p-4 flex items-center justify-between">
              {isSidebarOpen && <h1 className="text-lg font-bold">LMS & PM</h1>}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Nav items */}
          <div className="flex-1 py-4">
            <nav className="px-2 space-y-1">
              {navigationItems.map((section, idx) => {
                // For top-level items without sub-items
                if (!section.items) {
                  const item = section as {
                    title: string;
                    href: string;
                    icon: React.ReactNode;
                    roles: UserRole[];
                  };
                  
                  if (!hasAccess(item.roles)) {
                    return null;
                  }
                  
                  return (
                    <Link
                      key={`nav-${idx}`}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-x-2 py-2 px-3 rounded-md text-sm font-medium",
                        location === item.href
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      {item.icon}
                      {isSidebarOpen && item.title}
                    </Link>
                  );
                }

                // For sections with sub-items
                const sectionItems = (section.items ?? []).filter(item => 
                  hasAccess(item.roles)
                );
                
                if (sectionItems.length === 0) {
                  return null;
                }

                return (
                  <div key={`section-${idx}`} className="pt-4 first:pt-0">
                    {isSidebarOpen && (
                      <div className="px-3 mb-2">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                          {section.title}
                        </h3>
                      </div>
                    )}
                    {sectionItems.map((item, itemIdx) => (
                      <Link
                        key={`item-${idx}-${itemIdx}`}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-x-2 py-2 px-3 rounded-md text-sm font-medium",
                          location === item.href
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        {item.icon}
                        {isSidebarOpen && item.title}
                      </Link>
                    ))}
                    {idx < navigationItems.length - 1 && isSidebarOpen && (
                      <Separator className="my-4" />
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* User section */}
          <div className="sticky bottom-0 bg-background border-t p-4">
            <div className="flex items-center justify-between">
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.role}
                  </p>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}