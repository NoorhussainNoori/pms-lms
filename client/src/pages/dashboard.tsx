import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import MainLayout from "@/components/layout/main-layout";
import StatCard from "@/components/dashboard/stat-card";
import ActivityList, { ActivityItem } from "@/components/dashboard/activity-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRole } from "@shared/schema";
import { 
  Users, 
  GraduationCap, 
  FlagTriangleRight, 
  HelpCircle, 
  Briefcase,
  CheckSquare,
  HardHat,
  PieChart,
  DollarSign,
  Receipt,
  School,
  Building
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [moduleView, setModuleView] = useState<"lms" | "projects" | "finance">("lms");

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["/api/users?role=student"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.INSTRUCTOR
  });

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["/api/courses"],
    enabled: !!user
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["/api/projects"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.PROJECT_MANAGER || user?.role === UserRole.EMPLOYEE
  });

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: [user?.role === UserRole.EMPLOYEE ? `/api/employees/${user?.id}/tasks` : "/api/tasks"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.PROJECT_MANAGER || user?.role === UserRole.EMPLOYEE
  });

  // Render appropriate dashboard based on user role
  useEffect(() => {
    if (user) {
      if (user.role === UserRole.STUDENT || user.role === UserRole.INSTRUCTOR) {
        setModuleView("lms");
      } else if (user.role === UserRole.PROJECT_MANAGER || user.role === UserRole.EMPLOYEE) {
        setModuleView("projects");
      } else if (user.role === UserRole.FINANCE) {
        setModuleView("finance");
      }
    }
  }, [user]);

  // Create recent enrollments items for LMS dashboard
  const recentEnrollments: ActivityItem[] = [
    {
      id: 1,
      title: "Sarah Johnson",
      description: "Advanced Web Development",
      date: "Today",
      avatarText: "SJ"
    },
    {
      id: 2,
      title: "Michael Chen",
      description: "UX Design Fundamentals",
      date: "Yesterday",
      avatarText: "MC"
    },
    {
      id: 3,
      title: "David Smith",
      description: "JavaScript Mastery",
      date: "2 days ago",
      avatarText: "DS"
    }
  ];

  // Create recent quiz results for LMS dashboard
  const recentQuizResults: ActivityItem[] = [
    {
      id: 1,
      title: "HTML Basics Quiz",
      description: "Emma Wilson - 92%",
      date: "",
      status: "success",
      avatarText: "HQ"
    },
    {
      id: 2,
      title: "CSS Layouts Quiz",
      description: "James Brown - 65%",
      date: "",
      status: "error",
      avatarText: "CQ"
    },
    {
      id: 3,
      title: "JavaScript Basics Quiz",
      description: "Laura Miller - 88%",
      date: "",
      status: "success",
      avatarText: "JQ"
    }
  ];

  // Create upcoming tasks for LMS dashboard
  const upcomingTasks: ActivityItem[] = [
    {
      id: 1,
      title: "Grade Final Projects",
      description: "Web Development Course",
      date: "Due Today",
      status: "error",
      avatarText: "GF"
    },
    {
      id: 2,
      title: "Create New Quiz",
      description: "JavaScript Mastery",
      date: "Due Tomorrow",
      status: "warning",
      avatarText: "CQ"
    },
    {
      id: 3,
      title: "Upload CSS Tutorial",
      description: "UX Design Fundamentals",
      date: "In 3 days",
      status: "info",
      avatarText: "UT"
    }
  ];

  // Create project tasks for Project dashboard
  const projectTaskItems: ActivityItem[] = [
    {
      id: 1,
      title: "Design homepage mockup",
      description: "E-commerce Website",
      date: "Due Oct 12",
      status: "warning",
      avatarText: "DH"
    },
    {
      id: 2,
      title: "API integration for user auth",
      description: "Mobile App",
      date: "Due Oct 15",
      status: "warning",
      avatarText: "AI"
    },
    {
      id: 3,
      title: "Product listing page",
      description: "E-commerce Website",
      date: "Due Oct 18",
      status: "info",
      avatarText: "PL"
    }
  ];

  // Create student payments for Finance dashboard
  const studentPayments: ActivityItem[] = [
    {
      id: 1,
      title: "Sarah Johnson",
      description: "Advanced Web Development - $199.99",
      date: "Oct 5, 2023",
      status: "success",
      avatarText: "SJ"
    },
    {
      id: 2,
      title: "Michael Chen",
      description: "UX Design Fundamentals - $249.99",
      date: "Due: Oct 15, 2023",
      status: "error",
      avatarText: "MC"
    },
    {
      id: 3,
      title: "David Smith",
      description: "JavaScript Mastery - $129.99",
      date: "Oct 2, 2023",
      status: "success",
      avatarText: "DS"
    }
  ];

  // Create recent expenses for Finance dashboard
  const recentExpenses: ActivityItem[] = [
    {
      id: 1,
      title: "Office Supplies",
      description: "Operating Expense - $423.45",
      date: "Oct 8, 2023",
      status: "error",
      avatarText: "OS"
    },
    {
      id: 2,
      title: "Instructor Salaries",
      description: "Payroll - $5,842.30",
      date: "Oct 5, 2023",
      status: "error",
      avatarText: "IS"
    },
    {
      id: 3,
      title: "Software Subscriptions",
      description: "Technology - $1,256.99",
      date: "Oct 1, 2023",
      status: "error",
      avatarText: "SS"
    }
  ];

  return (
    <MainLayout module={moduleView}>
      {/* LMS Dashboard */}
      {moduleView === "lms" && (
        <div className="mb-6">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-4">LMS Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Students"
              value={isLoadingStudents ? "..." : students?.length || 156}
              icon={Users}
              iconColor="text-primary"
              iconBgColor="bg-blue-100"
              trend={{ value: "12% increase this month", isPositive: true }}
            />
            <StatCard
              title="Active Courses"
              value={isLoadingCourses ? "..." : courses?.length || 24}
              icon={GraduationCap}
              iconColor="text-success"
              iconBgColor="bg-green-100"
              trend={{ value: "3 new courses this month", isPositive: true }}
            />
            <StatCard
              title="Course Completion"
              value="78%"
              icon={FlagTriangleRight}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
              trend={{ value: "5% increase from last month", isPositive: true }}
            />
            <StatCard
              title="Quiz Pass Rate"
              value="82%"
              icon={HelpCircle}
              iconColor="text-yellow-600"
              iconBgColor="bg-yellow-100"
              trend={{ value: "3% decrease from last month", isPositive: false }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ActivityList 
              title="Recent Enrollments" 
              items={recentEnrollments}
              viewAllUrl="/students"
              isLoading={isLoadingStudents}
            />
            <ActivityList 
              title="Recent Quiz Results" 
              items={recentQuizResults}
              viewAllUrl="/quizzes"
            />
            <ActivityList 
              title="Upcoming Tasks" 
              items={upcomingTasks}
            />
          </div>
        </div>
      )}

      {/* Project Management Dashboard */}
      {moduleView === "projects" && (
        <div className="mb-6">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-4">Project Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Active Projects"
              value={isLoadingProjects ? "..." : projects?.length || 12}
              icon={Briefcase}
              iconColor="text-primary"
              iconBgColor="bg-blue-100"
              trend={{ value: "3 new this month", isPositive: true }}
            />
            <StatCard
              title="Pending Tasks"
              value={isLoadingTasks ? "..." : tasks?.filter(t => t.status !== "completed")?.length || 48}
              icon={CheckSquare}
              iconColor="text-orange-500"
              iconBgColor="bg-orange-100"
              trend={{ value: "12 tasks added this week", isPositive: false }}
            />
            <StatCard
              title="Team Members"
              value="18"
              icon={HardHat}
              iconColor="text-success"
              iconBgColor="bg-green-100"
              trend={{ value: "2 new hires this month", isPositive: true }}
            />
            <StatCard
              title="Completion Rate"
              value="72%"
              icon={PieChart}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
              trend={{ value: "8% increase from last month", isPositive: true }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ActivityList 
              title="To Do"
              items={projectTaskItems.filter(t => t.status === "warning")}
              viewAllUrl="/tasks"
              isLoading={isLoadingTasks}
            />
            <ActivityList 
              title="In Progress"
              items={projectTaskItems.filter(t => t.status === "info")}
              viewAllUrl="/tasks"
              isLoading={isLoadingTasks}
            />
            <ActivityList 
              title="Completed"
              items={[]}
              viewAllUrl="/tasks"
              isLoading={isLoadingTasks}
              emptyMessage="No tasks completed yet"
            />
          </div>
        </div>
      )}

      {/* Finance Dashboard */}
      {moduleView === "finance" && (
        <div className="mb-6">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-4">Finance Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Revenue"
              value="$65,248.30"
              icon={DollarSign}
              iconColor="text-success"
              iconBgColor="bg-green-100"
              trend={{ value: "12% increase from last month", isPositive: true }}
            />
            <StatCard
              title="Total Expenses"
              value="$35,127.84"
              icon={Receipt}
              iconColor="text-error"
              iconBgColor="bg-red-100"
              trend={{ value: "8% increase from last month", isPositive: false }}
            />
            <StatCard
              title="Course Income"
              value="$37,842.50"
              icon={School}
              iconColor="text-primary"
              iconBgColor="bg-blue-100"
              trend={{ value: "15% increase from last month", isPositive: true }}
            />
            <StatCard
              title="Project Income"
              value="$27,405.80"
              icon={Building}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
              trend={{ value: "9% increase from last month", isPositive: true }}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Revenue & Expense Overview</h3>
              <select className="border rounded-md text-sm px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600">
                <option>This Year</option>
                <option>Last Year</option>
                <option>Last 6 Months</option>
              </select>
            </div>
            <div className="h-72 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <BarChart3 className="h-16 w-16 mx-auto mb-2" />
                  <p>Revenue & Expense Chart</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Showing monthly trends for current year</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityList 
              title="Student Payment Status" 
              items={studentPayments}
              viewAllUrl="/payments"
            />
            <ActivityList 
              title="Recent Expenses" 
              items={recentExpenses}
              viewAllUrl="/expenses"
            />
          </div>
        </div>
      )}

      {/* Student Enrollment Section - visible only to admin users */}
      {user?.role === UserRole.ADMIN && moduleView === "lms" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="font-medium">Student Enrollment</h3>
          </div>
          <div className="p-4">
            <div className="flex flex-col md:flex-row mb-4">
              <div className="w-full md:w-1/2 md:pr-2 mb-4 md:mb-0">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Add New Student</h4>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-700 dark:text-gray-400 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-200" 
                          placeholder="Enter student name" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-700 dark:text-gray-400 mb-1">Email Address</label>
                        <input 
                          type="email" 
                          className="w-full px-3 py-2 border dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-200" 
                          placeholder="Enter email address" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-700 dark:text-gray-400 mb-1">Select Course</label>
                      <select className="w-full px-3 py-2 border dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-200">
                        <option>Advanced Web Development</option>
                        <option>UX Design Fundamentals</option>
                        <option>JavaScript Mastery</option>
                        <option>Python for Beginners</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-700 dark:text-gray-400 mb-1">Payment Status</label>
                        <select className="w-full px-3 py-2 border dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-200">
                          <option>Completed</option>
                          <option>Pending</option>
                          <option>Partial</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-700 dark:text-gray-400 mb-1">Amount Paid ($)</label>
                        <input 
                          type="number" 
                          className="w-full px-3 py-2 border dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-200" 
                          placeholder="0.00" 
                        />
                      </div>
                    </div>
                    <Button className="w-full" type="submit">
                      Add Student
                    </Button>
                  </form>
                </div>
              </div>
              <div className="w-full md:w-1/2 md:pl-2">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg h-full">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Course Statistics</h4>
                  <div className="space-y-4">
                    {/* Advanced Web Development */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium">Advanced Web Development</span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">42 students</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    {/* UX Design Fundamentals */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium">UX Design Fundamentals</span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">36 students</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    {/* JavaScript Mastery */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium">JavaScript Mastery</span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">28 students</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                    
                    {/* Python for Beginners */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium">Python for Beginners</span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">54 students</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div className="pt-3 mt-3 border-t dark:border-gray-700">
                      <Button variant="link" className="text-primary p-0">
                        Generate Detailed Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
