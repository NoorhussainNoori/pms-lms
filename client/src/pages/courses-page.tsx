import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";
import MainLayout from "@/components/layout/main-layout";
import CourseForm from "@/components/course/course-form";
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
import { Code, Palette, FileCode } from "lucide-react";

export default function CoursesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: courses, isLoading } = useQuery({
    queryKey: ["/api/courses"],
  });

  const { data: instructors } = useQuery({
    queryKey: ["/api/users?role=instructor"],
    enabled: user?.role === UserRole.ADMIN,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/courses/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Course deleted",
        description: "The course has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete course: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const getCourseIcon = (title: string) => {
    if (title.toLowerCase().includes("web")) return <Code className="h-5 w-5 text-primary" />;
    if (title.toLowerCase().includes("design")) return <Palette className="h-5 w-5 text-purple-600" />;
    return <FileCode className="h-5 w-5 text-blue-500" />;
  };

  const getInstructorName = (instructorId: number) => {
    if (!instructors) return "Loading...";
    const instructor = instructors.find((i: any) => i.id === instructorId);
    return instructor ? instructor.name : "Unassigned";
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteMutation.mutate(id);
    }
  };

  const onCloseDialog = () => {
    setIsDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
  };

  const canManageCourses = user && (user.role === UserRole.ADMIN || user.role === UserRole.INSTRUCTOR);

  return (
    <MainLayout module="lms">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200">Courses</h2>
          {canManageCourses && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <span className="material-icons text-sm">add</span>
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                </DialogHeader>
                <CourseForm onSuccess={onCloseDialog} instructors={instructors} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Course Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : courses && courses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course: any) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                              {getCourseIcon(course.title)}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{course.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{course.description?.substring(0, 30) || "No description"}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{course.instructorId ? getInstructorName(course.instructorId) : "Unassigned"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">--</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">${parseFloat(course.fee).toFixed(2)}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          {canManageCourses && (
                            <>
                              <Button variant="ghost" size="sm" className="text-primary mr-2">
                                Edit
                              </Button>
                              {user?.role === UserRole.ADMIN && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                  onClick={() => handleDelete(course.id)}
                                >
                                  Delete
                                </Button>
                              )}
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No courses found. Add a course to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
