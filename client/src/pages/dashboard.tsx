import { Activity, Book, Building, CreditCard, DollarSign, LayoutDashboard, Layers, PieChart, User, Users, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "../components/layout/main-layout";

export default function Dashboard() {
  // Mock data for the dashboard
  const stats = {
    totalStudents: 154,
    totalCourses: 12,
    totalInstructors: 8,
    totalProjects: 15,
    totalEmployees: 24,
    totalClients: 18,
    monthlyIncome: 15450,
    monthlyExpenses: 7820,
    activeQuizzes: 32,
    activeTasks: 87,
    completionRate: 78,
    pendingPayments: 12
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex flex-col gap-4 md:gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your LMS and Project Management System
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Total Students"
              value={stats.totalStudents}
              description="Active enrollments"
              icon={<Users className="h-5 w-5 text-muted-foreground" />}
            />
            <StatsCard 
              title="Total Courses"
              value={stats.totalCourses}
              description="Available courses"
              icon={<Book className="h-5 w-5 text-muted-foreground" />}
            />
            <StatsCard 
              title="Active Projects"
              value={stats.totalProjects}
              description="In progress"
              icon={<Layers className="h-5 w-5 text-muted-foreground" />}
            />
            <StatsCard 
              title="Total Income"
              value={`$${stats.monthlyIncome}`}
              description="Monthly revenue"
              icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>LMS Overview</span>
                  <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Learning management statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">
                        Students
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stats.totalStudents} total enrolled
                      </p>
                    </div>
                    <div className="ml-auto font-bold">{stats.totalStudents}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Book className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">
                        Courses
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stats.totalCourses} active courses
                      </p>
                    </div>
                    <div className="ml-auto font-bold">{stats.totalCourses}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">
                        Instructors
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Teaching staff
                      </p>
                    </div>
                    <div className="ml-auto font-bold">{stats.totalInstructors}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">
                        Quizzes
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Active assessments
                      </p>
                    </div>
                    <div className="ml-auto font-bold">{stats.activeQuizzes}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Project Management</span>
                  <Layers className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Project and task statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Layers className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">
                        Projects
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Active initiatives
                      </p>
                    </div>
                    <div className="ml-auto font-bold">{stats.totalProjects}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">
                        Tasks
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Assigned work items
                      </p>
                    </div>
                    <div className="ml-auto font-bold">{stats.activeTasks}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">
                        Employees
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Active team members
                      </p>
                    </div>
                    <div className="ml-auto font-bold">{stats.totalEmployees}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">
                        Clients
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Active customers
                      </p>
                    </div>
                    <div className="ml-auto font-bold">{stats.totalClients}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Financial Overview</span>
                  <PieChart className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Income and expenses summary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">
                        Monthly Income
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total revenue
                      </p>
                    </div>
                    <div className="ml-auto font-bold">${stats.monthlyIncome}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Wallet className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">
                        Monthly Expenses
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Operating costs
                      </p>
                    </div>
                    <div className="ml-auto font-bold">${stats.monthlyExpenses}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">
                        Pending Payments
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Awaiting settlement
                      </p>
                    </div>
                    <div className="ml-auto font-bold">{stats.pendingPayments}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <PieChart className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">
                        Net Profit
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Monthly earnings
                      </p>
                    </div>
                    <div className="ml-auto font-bold">${stats.monthlyIncome - stats.monthlyExpenses}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates across the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex">
                  <div className="relative mr-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New student registered
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Emma Johnson joined the platform
                    </p>
                    <p className="text-xs text-muted-foreground">
                      5 minutes ago
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                      <Book className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New course published
                    </p>
                    <p className="text-sm text-muted-foreground">
                      "Advanced React Development" is now available
                    </p>
                    <p className="text-xs text-muted-foreground">
                      2 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                      <Layers className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Project milestone reached
                    </p>
                    <p className="text-sm text-muted-foreground">
                      "Website Redesign" reached 75% completion
                    </p>
                    <p className="text-xs text-muted-foreground">
                      1 day ago
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                      <DollarSign className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Payment received
                    </p>
                    <p className="text-sm text-muted-foreground">
                      $3,500 payment from ABC Corporation
                    </p>
                    <p className="text-xs text-muted-foreground">
                      2 days ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}