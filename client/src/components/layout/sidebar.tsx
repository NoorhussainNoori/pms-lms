import { useLocation, Link } from "wouter";
import { useState } from "react";
import { UserRole } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Icons
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  HelpCircle,
  BookOpen,
  Briefcase,
  CheckSquare,
  HardHat,
  Building,
  Wallet,
  TrendingUp,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

export type Module = "lms" | "projects" | "finance";

interface SidebarProps {
  isOpen: boolean;
  activeModule: Module;
  setActiveModule: (module: Module) => void;
  onCloseSidebar?: () => void;
}

export default function Sidebar({ 
  isOpen, 
  activeModule, 
  setActiveModule,
  onCloseSidebar 
}: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Get user initials
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  const handleLinkClick = () => {
    if (onCloseSidebar && window.innerWidth < 1024) {
      onCloseSidebar();
    }
  };

  const NavLink = ({ href, icon, children }: { 
    href: string, 
    icon: React.ReactNode, 
    children: React.ReactNode 
  }) => {
    const isActive = location === href;
    
    return (
      <Link href={href}>
        <a 
          className={cn(
            "flex items-center py-2 px-3 rounded-lg transition-colors",
            isActive 
              ? "text-primary bg-blue-50 dark:bg-sidebar-accent" 
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          )}
          onClick={handleLinkClick}
        >
          <span className={cn(
            "mr-3", 
            isActive 
              ? "text-primary" 
              : "text-gray-500 dark:text-gray-400"
          )}>
            {icon}
          </span>
          <span>{children}</span>
        </a>
      </Link>
    );
  };

  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground w-64 shadow-lg overflow-y-auto transition-all duration-300 transform",
        "fixed lg:static h-full z-20",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="p-4 border-b">
        <div className="flex items-center">
          <Avatar className="w-10 h-10 mr-3 bg-primary">
            <AvatarFallback className="text-white font-medium">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
      
      <nav className="p-2">
        {/* Module Switcher */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex mb-4">
          <Button
            variant="ghost"
            className={cn(
              "flex-1 py-1 px-2 rounded-md text-sm font-medium h-auto",
              activeModule === "lms" && "bg-primary text-white"
            )}
            onClick={() => setActiveModule("lms")}
          >
            LMS
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "flex-1 py-1 px-2 rounded-md text-sm font-medium h-auto",
              activeModule === "projects" && "bg-primary text-white"
            )}
            onClick={() => setActiveModule("projects")}
          >
            Projects
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "flex-1 py-1 px-2 rounded-md text-sm font-medium h-auto",
              activeModule === "finance" && "bg-primary text-white"
            )}
            onClick={() => setActiveModule("finance")}
          >
            Finance
          </Button>
        </div>

        {/* LMS Navigation */}
        {activeModule === "lms" && (
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-3">
              LEARNING MANAGEMENT
            </p>
            <NavLink href="/" icon={<LayoutDashboard size={18} />}>
              Dashboard
            </NavLink>
            <NavLink href="/courses" icon={<GraduationCap size={18} />}>
              Courses
            </NavLink>
            <NavLink href="/students" icon={<Users size={18} />}>
              Students
            </NavLink>
            <NavLink href="/quizzes" icon={<HelpCircle size={18} />}>
              Quizzes
            </NavLink>
            <NavLink href="/instructors" icon={<BookOpen size={18} />}>
              Instructors
            </NavLink>
          </div>
        )}

        {/* Project Navigation */}
        {activeModule === "projects" && (
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-3">
              PROJECT MANAGEMENT
            </p>
            <NavLink href="/projects" icon={<Briefcase size={18} />}>
              Projects
            </NavLink>
            <NavLink href="/tasks" icon={<CheckSquare size={18} />}>
              Tasks
            </NavLink>
            <NavLink href="/employees" icon={<HardHat size={18} />}>
              Employees
            </NavLink>
            <NavLink href="/clients" icon={<Building size={18} />}>
              Clients
            </NavLink>
          </div>
        )}

        {/* Finance Navigation */}
        {activeModule === "finance" && (
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-3">
              FINANCE
            </p>
            <NavLink href="/payments" icon={<Wallet size={18} />}>
              Student Payments
            </NavLink>
            <NavLink href="/income" icon={<TrendingUp size={18} />}>
              Project Income
            </NavLink>
            <NavLink href="/expenses" icon={<Receipt size={18} />}>
              Expenses
            </NavLink>
            <NavLink href="/reports" icon={<BarChart3 size={18} />}>
              Reports
            </NavLink>
          </div>
        )}

        <div className="border-t mt-4 pt-4">
          <NavLink href="/settings" icon={<Settings size={18} />}>
            Settings
          </NavLink>
          <a
            className="flex items-center text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() => logoutMutation.mutate()}
          >
            <span className="material-icons mr-3 text-gray-500 dark:text-gray-400">
              <LogOut size={18} />
            </span>
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </aside>
  );
}
