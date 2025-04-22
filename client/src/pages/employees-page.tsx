import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";
import MainLayout from "@/components/layout/main-layout";
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
import { HardHat, Mail, Phone, MoreHorizontal, Briefcase } from "lucide-react";

export default function EmployeesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: employees, isLoading } = useQuery({
    queryKey: ["/api/users?role=employee"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.PROJECT_MANAGER,
  });

  const { data: tasks } = useQuery({
    queryKey: ["/api/tasks"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.PROJECT_MANAGER,
  });

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const canManageEmployees = user && (user.role === UserRole.ADMIN || user.role === UserRole.PROJECT_MANAGER);

  // Sample data for the static view
  const sampleEmployees = [
    {
      id: 1,
      name: "Michael Scott",
      email: "michael.scott@example.com",
      phone: "+1 (555) 123-4567",
      department: "Development",
      position: "Senior Developer",
      projectsCount: 3,
      tasksCount: 5,
      status: "active"
    },
    {
      id: 2,
      name: "Jim Halpert",
      email: "jim.halpert@example.com",
      phone: "+1 (555) 234-5678",
      department: "Development",
      position: "Full Stack Developer",
      projectsCount: 2,
      tasksCount: 3,
      status: "active"
    },
    {
      id: 3,
      name: "Pam Beesly",
      email: "pam.beesly@example.com",
      phone: "+1 (555) 345-6789",
      department: "Design",
      position: "UI/UX Designer",
      projectsCount: 2,
      tasksCount: 4,
      status: "active"
    },
    {
      id: 4,
      name: "Dwight Schrute",
      email: "dwight.schrute@example.com",
      phone: "+1 (555) 456-7890",
      department: "Quality Assurance",
      position: "QA Engineer",
      projectsCount: 2,
      tasksCount: 6,
      status: "active"
    }
  ];

  return (
    <MainLayout module="projects">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200">Employees</h2>
          {canManageEmployees && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <span className="material-icons text-sm">add</span>
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    Please use the registration form to add a new employee.
                  </p>
                  <Button className="w-full">Go to Registration Form</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Employee Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarFallback className="bg-primary text-white">
                                {getInitials(employee.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{employee.department}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3.5 w-3.5 mr-1 text-gray-500" />
                              <span className="text-xs">{employee.email}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="h-3.5 w-3.5 mr-1 text-gray-500" />
                              <span className="text-xs">{employee.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{employee.position}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{employee.projectsCount} projects</span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {employee.tasksCount} active tasks
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Active
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
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>View Tasks</DropdownMenuItem>
                              {canManageEmployees && (
                                <>
                                  <DropdownMenuItem>Edit Employee</DropdownMenuItem>
                                  <DropdownMenuItem>Assign to Project</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                    Deactivate Account
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
