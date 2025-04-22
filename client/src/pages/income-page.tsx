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
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  FileText,
  Building,
  Briefcase,
  Search,
  Download
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export default function IncomePage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.FINANCE || user?.role === UserRole.PROJECT_MANAGER,
  });

  // Sample data for the static view
  const sampleProjectPayments = [
    {
      id: 1,
      projectId: "PRJ-2023-001",
      projectName: "E-commerce Website Redesign",
      client: "Global Shop Inc.",
      amount: 5000.00,
      paymentDate: "2023-10-05",
      status: "completed",
      percentOfTotal: 20,
    },
    {
      id: 2,
      projectId: "PRJ-2023-001",
      projectName: "E-commerce Website Redesign",
      client: "Global Shop Inc.",
      amount: 8000.00,
      paymentDate: "2023-11-15",
      status: "pending",
      percentOfTotal: 30,
    },
    {
      id: 3,
      projectId: "PRJ-2023-002",
      projectName: "Mobile App Development",
      client: "FitLife Solutions",
      amount: 7500.00,
      paymentDate: "2023-09-28",
      status: "completed",
      percentOfTotal: 50,
    },
    {
      id: 4,
      projectId: "PRJ-2023-003",
      projectName: "CRM System Integration",
      client: "TechCorp International",
      amount: 10000.00,
      paymentDate: "2023-09-15",
      status: "completed",
      percentOfTotal: 40,
    },
    {
      id: 5,
      projectId: "PRJ-2023-003",
      projectName: "CRM System Integration",
      client: "TechCorp International",
      amount: 15000.00,
      paymentDate: "2023-10-30",
      status: "pending",
      percentOfTotal: 60,
    }
  ];

  const filteredPayments = sampleProjectPayments
    .filter(payment => {
      // Filter by search term
      const matchSearch = 
        payment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.projectId.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by payment status
      if (timeFilter === "completed") {
        return matchSearch && payment.status === "completed";
      } else if (timeFilter === "pending") {
        return matchSearch && payment.status === "pending";
      }
      
      return matchSearch;
    });

  // Calculate totals
  const totalCompleted = sampleProjectPayments
    .filter(payment => payment.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalPending = sampleProjectPayments
    .filter(payment => payment.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'pending':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  return (
    <MainLayout module="finance">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-6">Project Income</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Income</p>
                  <p className="text-2xl font-medium">${(totalCompleted + totalPending).toFixed(2)}</p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>12% increase from last month</span>
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Received Payments</p>
                  <p className="text-2xl font-medium">${totalCompleted.toFixed(2)}</p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>15% increase from last month</span>
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending Payments</p>
                  <p className="text-2xl font-medium">${totalPending.toFixed(2)}</p>
                  <p className="text-xs text-error flex items-center mt-1">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    <span>5% decrease from last month</span>
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Income Overview</CardTitle>
            <CardDescription>Monthly project income for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <BarChart className="h-16 w-16 mx-auto mb-2" />
                  <p>Income Overview Chart</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Displaying monthly project income</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Project Payment Details</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search payments..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{payment.projectName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{payment.projectId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{payment.client}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${payment.amount.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-full max-w-xs">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{payment.percentOfTotal}% of total</span>
                        </div>
                        <Progress value={payment.percentOfTotal} className="h-2" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <Search className="h-10 w-10 mb-2" />
                        <p>No payments found</p>
                        <p className="text-sm">Try adjusting your search terms or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
