import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";
import MainLayout from "@/components/layout/main-layout";
import PaymentForm from "@/components/finance/payment-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Wallet, 
  Calendar, 
  Users, 
  GraduationCap, 
  Search,
  FileEdit,
  Receipt,
  CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PaymentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: students } = useQuery({
    queryKey: ["/api/users?role=student"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.FINANCE,
  });

  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.FINANCE,
  });

  const canManagePayments = user && (user.role === UserRole.ADMIN || user.role === UserRole.FINANCE);

  const onCloseDialog = () => {
    setIsDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'unpaid':
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case 'partial':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  // Sample data for the static view
  const samplePayments = [
    {
      id: 1,
      studentName: "Sarah Johnson",
      studentEmail: "sarah.johnson@example.com",
      courseName: "Advanced Web Development",
      amount: 199.99,
      paymentDate: "2023-10-05",
      dueDate: "2023-10-01",
      status: "paid"
    },
    {
      id: 2,
      studentName: "Michael Chen",
      studentEmail: "michael.chen@example.com",
      courseName: "UX Design Fundamentals",
      amount: 249.99,
      paymentDate: null,
      dueDate: "2023-10-15",
      status: "unpaid"
    },
    {
      id: 3,
      studentName: "David Smith",
      studentEmail: "david.smith@example.com",
      courseName: "JavaScript Mastery",
      amount: 129.99,
      paymentDate: "2023-10-02",
      dueDate: "2023-10-01",
      status: "paid"
    },
    {
      id: 4,
      studentName: "Emma Wilson",
      studentEmail: "emma.wilson@example.com",
      courseName: "Python for Beginners",
      amount: 179.99,
      paymentDate: "2023-09-28",
      dueDate: "2023-10-01",
      status: "paid"
    },
    {
      id: 5,
      studentName: "James Brown",
      studentEmail: "james.brown@example.com",
      courseName: "Data Science Fundamentals",
      amount: 299.99,
      paymentDate: "2023-09-25",
      dueDate: "2023-10-01",
      status: "partial"
    }
  ];

  const filteredPayments = samplePayments.filter(
    payment =>
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout module="finance">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200">Student Payments</h2>
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
            {canManagePayments && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Record Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Record Student Payment</DialogTitle>
                  </DialogHeader>
                  <PaymentForm onSuccess={onCloseDialog} students={students} courses={courses} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Student Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarFallback className="bg-primary text-white">
                              {getInitials(payment.studentName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{payment.studentName}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{payment.studentEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{payment.courseName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${payment.amount.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                          {new Date(payment.dueDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.paymentDate ? (
                          <div className="flex items-center text-sm">
                            <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            {canManagePayments && (
                              <>
                                {payment.status !== "paid" && (
                                  <DropdownMenuItem>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Paid
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <FileEdit className="h-4 w-4 mr-2" />
                                  Edit Payment
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Receipt className="h-4 w-4 mr-2" />
                                  Generate Receipt
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                          <Search className="h-10 w-10 mb-2" />
                          <p>No payments found</p>
                          <p className="text-sm">Try adjusting your search terms</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
