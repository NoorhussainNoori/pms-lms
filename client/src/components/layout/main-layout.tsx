import { useState, useEffect } from "react";
import Header from "./header";
import Sidebar, { Module } from "./sidebar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  module?: Module;
}

export default function MainLayout({ children, module = "lms" }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<Module>(module);
  const { user } = useAuth();

  // Update the active module when the prop changes
  useEffect(() => {
    if (module) {
      setActiveModule(module);
    }
  }, [module]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          activeModule={activeModule} 
          setActiveModule={setActiveModule} 
          onCloseSidebar={closeSidebar}
        />
        
        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={closeSidebar}
          />
        )}
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
