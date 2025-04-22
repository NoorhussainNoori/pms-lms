import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

export default function TempDashboard() {
  const [user, setUser] = useState<User | null>(null);
  
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
  }, []);

  function handleLogout() {
    localStorage.removeItem("demoUser");
    setUser(null);
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">LMS & Project Management System</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user.name}</span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* LMS Features */}
          <div className="col-span-full mb-8">
            <h3 className="text-xl font-semibold mb-4">Learning Management System</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardCard 
                title="Courses" 
                value="12" 
                description="Active courses"
                icon="school"
              />
              <DashboardCard 
                title="Students" 
                value="156" 
                description="Enrolled students"
                icon="people"
              />
              <DashboardCard 
                title="Quizzes" 
                value="32" 
                description="Created quizzes"
                icon="quiz"
              />
            </div>
          </div>
          
          {/* Project Management Features */}
          <div className="col-span-full mb-8">
            <h3 className="text-xl font-semibold mb-4">Project Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardCard 
                title="Projects" 
                value="8" 
                description="Active projects"
                icon="work"
              />
              <DashboardCard 
                title="Tasks" 
                value="45" 
                description="Pending tasks"
                icon="task"
              />
              <DashboardCard 
                title="Employees" 
                value="24" 
                description="Team members"
                icon="groups"
              />
            </div>
          </div>
          
          {/* Financial Features */}
          <div className="col-span-full">
            <h3 className="text-xl font-semibold mb-4">Financial Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardCard 
                title="Income" 
                value="$12,450" 
                description="This month"
                icon="trending_up"
              />
              <DashboardCard 
                title="Expenses" 
                value="$5,890" 
                description="This month"
                icon="trending_down"
              />
              <DashboardCard 
                title="Balance" 
                value="$6,560" 
                description="Net profit"
                icon="account_balance"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ 
  title, 
  value, 
  description, 
  icon 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: string;
}) {
  return (
    <div className="bg-card rounded-lg shadow-sm p-6 border">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">{title}</h4>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <span className="material-icons text-4xl text-primary opacity-80">{icon}</span>
      </div>
    </div>
  );
}