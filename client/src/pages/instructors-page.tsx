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
import { MoreHorizontal, GraduationCap } from "lucide-react";

export default function InstructorsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: instructors, isLoading } = useQuery({
    queryKey: ["/api/users?role=instructor"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.INSTRUCTOR,
  });

  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const canManageInstructors = user && (user.role === UserRole.ADMIN);

  // Sample data for the static view
  const sampleInstructors = [
    {
      id: 1,
      name: "Jennifer Lee",
      email: "jennifer.lee@example.com",
      title: "Senior Developer",
      courses: ["Advanced Web Development", "JavaScript Basics"],
      status: "active"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      email: "michael.rodriguez@example.com",
      title: "Senior UX Designer",
      courses: ["UX Design Fundamentals"],
      status: "active"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      title: "Data Science Lead",
      courses: ["Python for Data Science", "Machine Learning Basics"],
      status: "active"
    },
  ];

  return (
    <MainLayout module="lms">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200">Instructors</h2>
          {canManageInstructors && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <span className="material-icons text-sm">add</span>
                  Add Instructor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add New Instructor</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    Please use the registration form to add a new instructor.
                  </p>
                  <Button className="w-full">Go to Registration Form</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Instructor Management</CardTitle>
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
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleInstructors.map((instructor) => (
                      <TableRow key={instructor.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarFallback className="bg-primary text-white">
                                {getInitials(instructor.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{instructor.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{instructor.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{instructor.title}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {instructor.courses.map((course, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-300 flex items-center"
                              >
                                <GraduationCap className="h-3 w-3 mr-1" />
                                {course}
                              </Badge>
                            ))}
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
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              {canManageInstructors && (
                                <>
                                  <DropdownMenuItem>Edit Instructor</DropdownMenuItem>
                                  <DropdownMenuItem>Assign Courses</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                    Remove Instructor
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
