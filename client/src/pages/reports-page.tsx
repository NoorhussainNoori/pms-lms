import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";
import MainLayout from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart4, 
  PieChart, 
  LineChart, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Users,
  GraduationCap,
  BookOpen,
  HelpCircle,
  Briefcase,
  CheckSquare
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReportsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("thisYear");
  const [activeTab, setActiveTab] = useState("financial");

  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.FINANCE || user?.role === UserRole.INSTRUCTOR,
  });

  const { data: students } = useQuery({
    queryKey: ["/api/users?role=student"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.FINANCE || user?.role === UserRole.INSTRUCTOR,
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.FINANCE || user?.role === UserRole.PROJECT_MANAGER,
  });

  // Financial metrics
  const financialMetrics = [
    {
      title: "Total Revenue",
      value: "$65,248.30",
      change: "+12%",
      isPositive: true,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Expenses",
      value: "$35,127.84",
      change: "+8%",
      isPositive: false,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Net Profit",
      value: "$30,120.46",
      change: "+15%",
      isPositive: true,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Profit Margin",
      value: "46.2%",
      change: "+2.5%",
      isPositive: true,
      icon: PieChart,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  // LMS metrics
  const lmsMetrics = [
    {
      title: "Total Students",
      value: "156",
      change: "+12%",
      isPositive: true,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-blue-100"
    },
    {
      title: "Active Courses",
      value: "24",
      change: "+3",
      isPositive: true,
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Course Enrollments",
      value: "342",
      change: "+28",
      isPositive: true,
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Quiz Completions",
      value: "487",
      change: "+54",
      isPositive: true,
      icon: HelpCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  // Project metrics
  const projectMetrics = [
    {
      title: "Active Projects",
      value: "12",
      change: "+3",
      isPositive: true,
      icon: Briefcase,
      color: "text-primary",
      bgColor: "bg-blue-100"
    },
    {
      title: "Completed Projects",
      value: "35",
      change: "+5",
      isPositive: true,
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Avg. Project Value",
      value: "$18,450",
      change: "+$1,250",
      isPositive: true,
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Avg. Completion Time",
      value: "32 days",
      change: "-3 days",
      isPositive: true,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <MainLayout module="finance">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200">Reports & Analytics</h2>
          <div className="flex space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="thisQuarter">This Quarter</SelectItem>
                <SelectItem value="lastQuarter">Last Quarter</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
                <SelectItem value="lastYear">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="lms">LMS</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="financial">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {financialMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.title}</p>
                        <p className="text-2xl font-medium">{metric.value}</p>
                        <p className={`text-xs flex items-center mt-1 ${metric.isPositive ? 'text-success' : 'text-error'}`}>
                          {metric.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          <span>{metric.change} {timeRange === 'thisMonth' ? 'this month' : 'this year'}</span>
                        </p>
                      </div>
                      <div className={`h-12 w-12 rounded-full ${metric.bgColor} dark:bg-opacity-20 flex items-center justify-center`}>
                        <metric.icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Expenses</CardTitle>
                  <CardDescription>Monthly comparison of income and expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <BarChart4 className="h-16 w-16 mx-auto mb-2" />
                        <p>Revenue vs Expenses Chart</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Monthly comparison</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-lg font-medium text-green-600">$65,248.30</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Expenses</p>
                    <p className="text-lg font-medium text-red-600">$35,127.84</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Net Profit</p>
                    <p className="text-lg font-medium text-blue-600">$30,120.46</p>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Income Breakdown</CardTitle>
                  <CardDescription>Distribution of income by source</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <PieChart className="h-16 w-16 mx-auto mb-2" />
                        <p>Income Breakdown Chart</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Distribution by source</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Course Income</p>
                    <p className="text-lg font-medium text-blue-600">$37,842.50</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Project Income</p>
                    <p className="text-lg font-medium text-purple-600">$27,405.80</p>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Financial Trends</CardTitle>
                <CardDescription>Annual financial performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <LineChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Financial Trends Chart</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Annual financial performance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lms">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {lmsMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.title}</p>
                        <p className="text-2xl font-medium">{metric.value}</p>
                        <p className={`text-xs flex items-center mt-1 ${metric.isPositive ? 'text-success' : 'text-error'}`}>
                          {metric.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          <span>{metric.change} {timeRange === 'thisMonth' ? 'this month' : 'this year'}</span>
                        </p>
                      </div>
                      <div className={`h-12 w-12 rounded-full ${metric.bgColor} dark:bg-opacity-20 flex items-center justify-center`}>
                        <metric.icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Enrollments</CardTitle>
                  <CardDescription>Monthly enrollment trends by course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <BarChart4 className="h-16 w-16 mx-auto mb-2" />
                        <p>Course Enrollments Chart</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Monthly enrollment trends</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Progress</CardTitle>
                  <CardDescription>Completion rates and quiz performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <LineChart className="h-16 w-16 mx-auto mb-2" />
                        <p>Student Progress Chart</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Completion rates and quiz performance</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Course Popularity</CardTitle>
                <CardDescription>Distribution of students across courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <PieChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Course Popularity Chart</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Distribution of students across courses</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {projectMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.title}</p>
                        <p className="text-2xl font-medium">{metric.value}</p>
                        <p className={`text-xs flex items-center mt-1 ${metric.isPositive ? 'text-success' : 'text-error'}`}>
                          {metric.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          <span>{metric.change} {timeRange === 'thisMonth' ? 'this month' : 'this year'}</span>
                        </p>
                      </div>
                      <div className={`h-12 w-12 rounded-full ${metric.bgColor} dark:bg-opacity-20 flex items-center justify-center`}>
                        <metric.icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Status</CardTitle>
                  <CardDescription>Distribution of projects by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <PieChart className="h-16 w-16 mx-auto mb-2" />
                        <p>Project Status Chart</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Distribution by status</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Revenue</CardTitle>
                  <CardDescription>Revenue generated from projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <BarChart4 className="h-16 w-16 mx-auto mb-2" />
                        <p>Project Revenue Chart</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Revenue by project</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Task Completion Trends</CardTitle>
                <CardDescription>Monthly task completion performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <LineChart className="h-16 w-16 mx-auto mb-2" />
                      <p>Task Completion Trends Chart</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Monthly task completion performance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
